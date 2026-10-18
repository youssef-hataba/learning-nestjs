# Google OAuth 2.0 Full-Stack Implementation Guide — Line-by-Line Technical Reference

> **Document Type:** Exhaustive Technical Implementation & Code Deep-Dive  
> **Status:** Active / Production-Ready  
> **Backend Framework:** NestJS 12 + TypeORM + PostgreSQL + EventEmitter2 + JWT  
> **Frontend Framework:** Next.js 16 (Turbopack + App Router) + React 19 + TailwindCSS  
> **Protocol:** OAuth 2.0 Authorization Code Flow via Google Identity  

---

## 1. Architectural File Manifest

The Google Authentication system spans across both backend and frontend layers:

```text
learning-nestjs/
├── backend/
│   ├── .env                                       <-- Google OAuth client credentials & redirect targets
│   └── src/
│       └── users/
│           ├── user.entity.ts                     <-- Added googleId, made password nullable varchar
│           ├── users.controller.ts                <-- Added /google & /google/callback HTTP endpoints
│           └── users.service.ts                   <-- OAuth URL generator, token exchange, account linker
└── frontend/
    ├── next.config.ts                             <-- Configured allowedDevOrigins for cross-origin redirects
    └── src/
        └── app/
            └── auth/
                ├── callback/
                │   └── page.tsx                   <-- Dedicated callback handler with Suspense boundary
                └── components/
                    ├── LoginForm.tsx              <-- Wired "Continue with Google" button
                    └── RegisterEmailStep.tsx      <-- Wired "Continue with Google" button
```

---

## 2. Database Entity Layer: `user.entity.ts`

### 2.1 Code Implementation

```typescript
// backend/src/users/user.entity.ts

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false, type: "varchar", nullable: true, default: null })
    password: string | null;

    @Column({ nullable: true, unique: true, type: "varchar", default: null })
    googleId: string | null;

    @Column({
        type: "enum",
        enum: UserType,
        default: UserType.USER,
        select: false,
    })
    userType: UserType;

    @Column({ default: false })
    isAccountVerified: boolean;

    @Column({ nullable: true, type: "varchar", default: null })
    profileImage: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: false })
    deletedByAdmin: boolean;

    @DeleteDateColumn()
    deletedAt: Date | null;
}
```

### 2.2 Exhaustive Line-by-Line Breakdown

#### `password: string | null;`
```typescript
@Column({ select: false, type: "varchar", nullable: true, default: null })
password: string | null;
```
* `@Column(...)`: TypeORM decorator mapping this class property to a database table column in PostgreSQL.
* `select: false`: Crucial security flag. When executing standard queries like `usersRepository.find()` or `usersRepository.findOne()`, TypeORM will **exclude** the password column from the returned SQL `SELECT` statement by default. This prevents accidental leakage of password hashes in API responses or debug logs.
* `type: "varchar"`: **Mandatory technical requirement.** When TypeScript compiles a property typed with a union (`string | null`), the emitted decorator metadata reflects `design:type: Object`. Without explicit `type: "varchar"`, TypeORM throws a fatal startup crash: `DataTypeNotSupportedError: Data type "Object" in "User.password" is not supported by "postgres" database`. Explicitly declaring `"varchar"` resolves this ambiguity.
* `nullable: true`: Instructs PostgreSQL that the column accepts SQL `NULL` values. Users who register exclusively through Google have no password.
* `default: null`: Ensures any record created without an explicit password attribute defaults cleanly to `NULL` in the database.
* `password: string | null;`: TypeScript type definition reflecting that the value can either be a hashed string or null.

#### `googleId: string | null;`
```typescript
@Column({ nullable: true, unique: true, type: "varchar", default: null })
googleId: string | null;
```
* `nullable: true`: Users registered via traditional email/password will not have a Google ID initially.
* `unique: true`: Creates a unique constraint index in PostgreSQL (`users_googleId_unique`). This guarantees that no two accounts can ever be linked to the same Google identity.
* `type: "varchar"`: Stores the numeric/alphanumeric Google Subject ID (`sub`) string.
* `googleId: string | null;`: Maps to Google's immutable identity subject identifier (e.g., `"109482910492810482910"`).

---

## 3. Backend Service Layer: `users.service.ts`

### 3.1 Constructor & Dependency Injection

```typescript
// backend/src/users/users.service.ts

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
        private readonly redisService: RedisService,
        private readonly configService: ConfigService,
    ) {}
```
* `private readonly configService: ConfigService`: Injects NestJS's unified configuration service to read environment variables (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`, `FRONTEND_URL`) safely from `.env`.

---

### 3.2 Method: `getGoogleAuthUrl()`

Generates the cryptographically signed authorization URL that directs the user's browser to Google's consent screen.

```typescript
getGoogleAuthUrl(): string {
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    const redirectUri = this.configService.get<string>(
        "GOOGLE_CALLBACK_URL",
        "http://localhost:3000/api/users/auth/google/callback"
    );

    if (!clientId) {
        throw new BadRequestException("GOOGLE_CLIENT_ID is not configured.");
    }

    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid profile email",
        access_type: "offline",
        prompt: "consent",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
```

#### Line-by-Line Breakdown:
1. `const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");`: Retrieves the public client identifier issued by Google Cloud Console.
2. `const redirectUri = ...`: Retrieves the registered callback endpoint. If unset, it defaults safely to the local development route.
3. `if (!clientId) { throw new BadRequestException(...); }`: Fast-fail assertion ensuring the application does not emit malformed OAuth requests if configuration is missing.
4. `const params = new URLSearchParams({ ... });`: Standard Web API class that serializes key-value pairs into application/x-www-form-urlencoded format with automatic percent-encoding.
   * `client_id: clientId`: Identifies our application to Google.
   * `redirect_uri: redirectUri`: The exact destination URL where Google will return the user after consent. **Must match Google Cloud Console settings character-for-character.**
   * `response_type: "code"`: Instructs Google to execute the secure **Authorization Code Flow** rather than returning tokens directly.
   * `scope: "openid profile email"`: Requests permission to access the user's OpenID identity, full name, profile picture, and verified email address.
   * `access_type: "offline"`: Requests a refresh token if needed for long-term background operations.
   * `prompt: "consent"`: Forces the Google consent screen to appear, ensuring the user can explicitly choose which Google account to use.
5. `return \`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}\`;`: Returns the full URL string to the controller for HTTP redirection.

---

### 3.3 Method: `getFrontendUrl()`

```typescript
getFrontendUrl(): string {
    return this.configService.get<string>("FRONTEND_URL", "http://localhost:3001");
}
```
* Centralized helper returning the frontend origin so callback redirects can easily adapt between local development (`:3001`) and production environments.

---

### 3.4 Method: `handleGoogleCallback(code: string)`

The core orchestrator of server-side token exchange, identity verification, account linking, and JWT generation.

```typescript
async handleGoogleCallback(code: string): Promise<string> {
    const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
    const clientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
    const redirectUri = this.configService.get<string>(
        "GOOGLE_CALLBACK_URL",
        "http://localhost:3000/api/users/auth/google/callback"
    );
    const frontendUrl = this.getFrontendUrl();

    if (!clientId || !clientSecret) {
        throw new BadRequestException("Google OAuth credentials are not configured.");
    }
```
* Validates that both the public ID and the private secret are loaded before executing network calls.

#### Step 1: Exchange Authorization Code for Access Token
```typescript
    // 1. Exchange authorization code for Google access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        }),
    });

    if (!tokenResponse.ok) {
        const errorDetails = await tokenResponse.text();
        throw new BadRequestException(`Google code exchange failed: ${errorDetails}`);
    }

    const tokenData = (await tokenResponse.json()) as { access_token: string };
    const accessToken = tokenData.access_token;
```
* `fetch("https://oauth2.googleapis.com/token", ...)`: Makes an outbound server-to-server HTTP POST request directly to Google's token endpoint over encrypted TLS.
* `grant_type: "authorization_code"`: Informs Google that we are exchanging a short-lived authorization code.
* `client_secret`: Proves to Google that this server owns the OAuth application.
* `if (!tokenResponse.ok)`: Defensive error handling. If the code was expired, already used, or revoked, Google returns a 4xx error. We parse the error text and abort safely.
* `tokenData.access_token`: Extracts the temporary bearer token required to read user profile data.

#### Step 2: Fetch Google User Profile Data
```typescript
    // 2. Fetch user information from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!userInfoResponse.ok) {
        throw new BadRequestException("Failed to fetch Google user profile");
    }

    const googleUser = (await userInfoResponse.json()) as {
        sub: string;
        email: string;
        name?: string;
        picture?: string;
        email_verified?: boolean;
    };

    if (!googleUser.email) {
        throw new BadRequestException("No email associated with this Google account");
    }
```
* Calls Google's standardized OpenID Connect UserInfo endpoint using `Authorization: Bearer <accessToken>`.
* `googleUser.sub`: The unique, immutable Google subject identifier for the user.
* `googleUser.email`: The user's primary Google email address.
* `googleUser.picture`: The hosted Google profile avatar URL.

#### Step 3: Identity Resolution & Smart Account Linking
```typescript
    // 3. Find or create user in database
    let user = await this.usersRepository.findOne({
        where: [{ googleId: googleUser.sub }, { email: googleUser.email }],
        withDeleted: true,
    });
```
* `where: [{ googleId: ... }, { email: ... }]`: TypeORM executes an SQL `OR` condition (`WHERE googleId = $1 OR email = $2`).
* `withDeleted: true`: Includes soft-deleted records in the search so that deleted accounts within the 30-day grace period can be restored.

```typescript
    if (user) {
        if (user.deletedAt) {
            // Restore account if user was deleted
            await this.usersRepository.restore(user.id);
            user.deletedAt = null;
        }

        let updated = false;
        if (!user.googleId) {
            user.googleId = googleUser.sub;
            updated = true;
        }
        if (!user.isAccountVerified) {
            user.isAccountVerified = true;
            updated = true;
        }
        if (!user.profileImage && googleUser.picture) {
            user.profileImage = googleUser.picture;
            updated = true;
        }
        if (updated) {
            user = await this.usersRepository.save(user);
        }
    }
```
* `await this.usersRepository.restore(user.id)`: Reverses soft deletion if the user returns within the grace period.
* `if (!user.googleId)`: **Smart Linking.** If the user originally signed up with a traditional password, their `googleId` is null. We link their Google identity to this existing account so their past orders and data remain intact.
* `user.isAccountVerified = true`: Since Google already verified the email, we mark the local account verified.
* `user.profileImage = googleUser.picture`: If the user never uploaded an avatar, we populate it with their Google picture.

#### Step 4: Self-Registration for Brand-New Users
```typescript
    else {
        // Generate clean unique username
        const rawName = (googleUser.name || googleUser.email.split("@")[0])
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_")
            .slice(0, 15);
        const baseUsername = rawName.length >= 3 ? rawName : `user_${Math.floor(100 + Math.random() * 900)}`;

        let username = baseUsername;
        let counter = 1;
        while (await this.usersRepository.findOne({ where: { username }, withDeleted: true })) {
            username = `${baseUsername.slice(0, 10)}_${Math.floor(1000 + Math.random() * 9000)}`;
            counter++;
            if (counter > 15) break;
        }

        const newUser = this.usersRepository.create({
            username,
            email: googleUser.email,
            googleId: googleUser.sub,
            profileImage: googleUser.picture || null,
            isAccountVerified: true,
            userType: UserType.USER,
            password: null,
        });

        user = await this.usersRepository.save(newUser);

        // Emit user registered domain event for welcome email
        this.eventEmitter.emit(EVENT_USER_REGISTERED, {
            userId: user.id,
            email: user.email,
            username: user.username,
        });
    }
```
* `rawName.replace(/[^a-z0-9_]/g, "_")`: Sanitizes the Google display name into an alphanumeric username slug.
* `while (await this.usersRepository.findOne(...))`: Resolves username collisions. If `@alex` already exists, it checks `@alex_4821`, ensuring unique usernames automatically.
* `password: null`: Safely marks the user as having no traditional password.
* `this.eventEmitter.emit(EVENT_USER_REGISTERED, ...)`: Dispatches the domain event to BullMQ, triggering the background welcome email without blocking the OAuth response!

#### Step 5: Session Generation & Redirect Building
```typescript
    // 4. Generate Planto JWT
    const token = this.generateJWT({
        userId: user.id,
        userType: user.userType,
    });

    // 5. Return redirect destination to frontend
    return `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`;
}
```
* `this.generateJWT(...)`: Signs our application's standard JWT session containing `userId` and `userType`.
* `encodeURIComponent(token)`: Safely encodes the token for insertion into the URL query string.

---

### 3.5 Defensive Guard in Traditional `login()`

```typescript
// backend/src/users/users.service.ts -> login()

if (!user) {
    throw new BadRequestException("Invalid email or password");
}

if (!user.password) {
    throw new BadRequestException(
        "This account was registered using Google. Please click 'Continue with Google' to sign in."
    );
}

const isPasswordMatch = await bcrypt.compare(password, user.password);
```
* `if (!user.password)`: Intercepts login attempts where a user registered via Google tries to enter a traditional password. This prevents `bcrypt.compare(password, null)` from throwing a runtime crash, while giving the user an actionable error message.

---

## 4. Backend Controller Layer: `users.controller.ts`

```typescript
// backend/src/users/users.controller.ts

// ==========================================
// 🌐 GOOGLE OAUTH 2.0
// ==========================================
@Get("google")
googleAuth(@Res() res: Response) {
    const url = this.usersService.getGoogleAuthUrl();
    return res.redirect(url);
}

@Get("google/callback")
async googleAuthCallback(
    @Query("code") code: string,
    @Query("error") error: string,
    @Res() res: Response,
) {
    const frontendUrl = this.usersService.getFrontendUrl();
    if (error || !code) {
        return res.redirect(
            `${frontendUrl}/auth/callback?error=${encodeURIComponent(error || "no_code")}`
        );
    }

    try {
        const redirectUrl = await this.usersService.handleGoogleCallback(code);
        return res.redirect(redirectUrl);
    } catch (err: any) {
        return res.redirect(
            `${frontendUrl}/auth/callback?error=${encodeURIComponent(err.message || "auth_failed")}`
        );
    }
}
```

### Line-by-Line Breakdown:
* `@Get("google")`: Registers endpoint `GET /api/users/auth/google`.
* `@Res() res: Response`: Injects the underlying Express response object to perform native HTTP 302 redirects.
* `res.redirect(url)`: Redirects the browser immediately to `accounts.google.com`.
* `@Get("google/callback")`: The landing route that Google invokes upon user consent.
* `@Query("code") code: string`: Extracts the authorization code provided by Google.
* `@Query("error") error: string`: Captures any cancellation or rejection signal if the user clicks "Cancel" on the Google consent page.
* `if (error || !code)`: If the user cancelled, gracefully redirects to the frontend callback route with `?error=access_denied` instead of throwing an unhandled server error.
* `try { ... } catch (err)`: Catches network timeouts or invalid code exceptions, safely redirecting the user back to the frontend with an error query parameter.

---

## 5. Frontend Callback Layer: `auth/callback/page.tsx`

```typescript
// frontend/src/app/auth/callback/page.tsx
'use client';

import { Suspense, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { notify } from '@/lib/notifications';
import { useCurrentUser } from '@/app/auth/hooks';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { triggerRefetch } = useCurrentUser();
  const processedRef = useRef(false);

  useEffect(() => {
    if (processedRef.current) return;
    processedRef.current = true;

    const token = searchParams.get('token');
    const error = searchParams.get('error');

    if (token) {
      localStorage.setItem('token', token);
      triggerRefetch();
      notify.success(
        'Signed in with Google successfully! Welcome to your Planto sanctuary.',
        'Access Granted'
      );
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    } else if (error) {
      notify.error(
        decodeURIComponent(error) || 'Google sign-in was cancelled or failed. Please try again.',
        'Google Auth Failed'
      );
      setTimeout(() => {
        router.replace('/');
      }, 800);
    } else {
      router.replace('/');
    }
  }, [searchParams, router, triggerRefetch]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 bg-[#b6f076]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Sanctuary Loading Card */}
      <div className="relative z-10 bg-[#161d16]/90 border border-white/10 rounded-3xl p-8 sm:p-10 max-w-md w-full text-center shadow-2xl backdrop-blur-2xl">
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-[#b6f076]/20 border-t-[#b6f076] animate-spin" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-[#f6ffe4] tracking-tight mb-2">
          Verifying Google Sanctuary Pass
        </h2>
        <p className="text-xs sm:text-sm text-[#c2c9b5]/70 leading-relaxed">
          Connecting to your botanical profile and establishing secure session tokens...
        </p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center text-xs text-[#c2c9b5]">
          Loading sanctuary gateway...
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
```

### Line-by-Line Breakdown:
* `'use client';`: Marks this component as a React Client Component since it accesses browser APIs (`localStorage`, `window.location`).
* `const processedRef = useRef(false);`: **React StrictMode Defense.** In development mode, React runs `useEffect` twice on mount. `processedRef` ensures the token is parsed and the notification is emitted **only once**.
* `const token = searchParams.get('token');`: Reads the JWT token parameter delivered in the redirect URL.
* `localStorage.setItem('token', token);`: Persists the token to local storage so all subsequent requests sent by `apiFetch()` attach `Authorization: Bearer <token>`.
* `triggerRefetch();`: Invalidates and refreshes the Dolab user cache, updating the global Navbar state instantly.
* `notify.success(...)`: Displays our custom smooth animated toast notification.
* `window.location.href = '/';`: Triggers a clean navigation back to the store homepage.
* `<Suspense fallback={...}>`: **Mandatory Next.js App Router requirement.** Components calling `useSearchParams()` during client-side rendering must be wrapped in a `<Suspense>` boundary to prevent de-optimizing the route during build time.

---

## 6. Frontend UI Integration Layer

### 6.1 `LoginForm.tsx` & `RegisterEmailStep.tsx`

Both components bind their "Continue with Google" buttons directly to the backend initiation route:

```typescript
function handleGoogleAuth() {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  window.location.href = `${backendUrl}/users/auth/google`;
}
```
* Bypasses client-side routing and navigates directly to the NestJS endpoint, triggering the clean browser redirect to Google.

### 6.2 `next.config.ts`: Cross-Origin Protection

```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["localhost:3000", "localhost:3001", "127.0.0.1:3000", "127.0.0.1:3001"],
  cacheComponents: true,
  partialPrefetching: true,
  // ...
};
```
* `allowedDevOrigins`: Instructs Next.js development server to allow cross-origin navigation headers between the backend (`:3000`) and the frontend (`:3001`), preventing dev-server CORS blocking warnings upon redirect.

---

## 7. Production Verification Checklist

1. [x] PostgreSQL columns `googleId` and nullable `password` created with explicit `varchar` type.
2. [x] TypeScript builds successfully with zero compiler errors (`npm run build` exits 0).
3. [x] Next.js App Router prerenders `/auth/callback` statically without build de-optimizations.
4. [x] Google Cloud Console **Authorized JavaScript origins** configured strictly without trailing slash:
   ```
   http://localhost:3000
   http://localhost:3001
   ```
5. [x] Google Cloud Console **Authorized redirect URIs** configured with the exact backend route:
   ```
   http://localhost:3000/api/users/auth/google/callback
   ```
6. [x] Environment variables verified in `backend/.env`:
   ```env
   GOOGLE_CLIENT_ID=your_actual_client_id
   GOOGLE_CLIENT_SECRET=your_actual_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/users/auth/google/callback
   FRONTEND_URL=http://localhost:3001
   ```
