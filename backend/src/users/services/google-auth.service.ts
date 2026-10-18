import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "../user.entity.js";
import { UserType } from "../../utils/enums.js";
import { JwtPayload } from "../../utils/types.js";
import { EVENT_USER_REGISTERED } from "../../mail/mail.constants.js";

export interface GoogleUserProfile {
    sub: string;
    email: string;
    name?: string;
    picture?: string;
    email_verified?: boolean;
}

@Injectable()
export class GoogleAuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    private generateJWT(payload: JwtPayload): string {
        return this.jwtService.sign(payload);
    }

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

    getFrontendUrl(): string {
        return this.configService.get<string>("FRONTEND_URL", "http://localhost:3001");
    }

    /**
     * Complete handler for Google OAuth 2.0 callback.
     * Orchestrates token exchange, profile retrieval, user sync, and token redirection.
     */
    async handleGoogleCallback(code?: string, error?: string): Promise<string> {
        const frontendUrl = this.getFrontendUrl();

        if (error || !code) {
            return `${frontendUrl}/auth/callback?error=${encodeURIComponent(error || "no_code")}`;
        }

        try {
            const accessToken = await this.exchangeCodeForToken(code);
            const profile = await this.fetchGoogleProfile(accessToken);
            const user = await this.findOrCreateGoogleUser(profile);

            const token = this.generateJWT({
                userId: user.id,
                userType: user.userType,
            });

            return `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`;
        } catch (err: any) {
            return `${frontendUrl}/auth/callback?error=${encodeURIComponent(err.message || "auth_failed")}`;
        }
    }

    // ==========================================
    // 🔒 PRIVATE WORKFLOW HELPERS
    // ==========================================

    /**
     * Exchanges the authorization code for a Google access token.
     */
    private async exchangeCodeForToken(code: string): Promise<string> {
        const clientId = this.configService.get<string>("GOOGLE_CLIENT_ID");
        const clientSecret = this.configService.get<string>("GOOGLE_CLIENT_SECRET");
        const redirectUri = this.configService.get<string>(
            "GOOGLE_CALLBACK_URL",
            "http://localhost:3000/api/users/auth/google/callback"
        );

        if (!clientId || !clientSecret) {
            throw new BadRequestException("Google OAuth credentials are not configured.");
        }

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
        return tokenData.access_token;
    }

    /**
     * Fetches user profile from the Google UserInfo v3 endpoint.
     */
    private async fetchGoogleProfile(accessToken: string): Promise<GoogleUserProfile> {
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!userInfoResponse.ok) {
            throw new BadRequestException("Failed to fetch Google user profile");
        }

        const profile = (await userInfoResponse.json()) as GoogleUserProfile;
        if (!profile.email) {
            throw new BadRequestException("No email associated with this Google account");
        }

        return profile;
    }

    /**
     * Finds an existing account (by googleId or email) or creates a new one.
     * Performs automatic account linking and 30-day grace period restoration.
     */
    private async findOrCreateGoogleUser(profile: GoogleUserProfile): Promise<User> {
        let user = await this.usersRepository.findOne({
            where: [{ googleId: profile.sub }, { email: profile.email }],
            withDeleted: true,
        });

        if (user) {
            return await this.syncExistingUser(user, profile);
        }

        return await this.createNewGoogleUser(profile);
    }

    /**
     * Synchronizes missing Google credentials and restores deleted accounts within grace period.
     */
    private async syncExistingUser(user: User, profile: GoogleUserProfile): Promise<User> {
        if (user.deletedAt) {
            await this.usersRepository.restore(user.id);
            user.deletedAt = null;
        }

        let isUpdated = false;
        if (!user.googleId) {
            user.googleId = profile.sub;
            isUpdated = true;
        }
        if (!user.isAccountVerified) {
            user.isAccountVerified = true;
            isUpdated = true;
        }
        if (!user.profileImage && profile.picture) {
            user.profileImage = profile.picture;
            isUpdated = true;
        }

        return isUpdated ? await this.usersRepository.save(user) : user;
    }

    /**
     * Registers a new user based on Google profile data.
     */
    private async createNewGoogleUser(profile: GoogleUserProfile): Promise<User> {
        const username = await this.generateUniqueUsername(profile);

        const newUser = this.usersRepository.create({
            username,
            email: profile.email,
            googleId: profile.sub,
            profileImage: profile.picture || null,
            isAccountVerified: true,
            userType: UserType.USER,
            password: null,
        });

        const savedUser = await this.usersRepository.save(newUser);

        // Emit domain event for welcome email
        this.eventEmitter.emit(EVENT_USER_REGISTERED, {
            userId: savedUser.id,
            email: savedUser.email,
            username: savedUser.username,
        });

        return savedUser;
    }

    /**
     * Generates a collision-free username derived from the user's name or email.
     */
    private async generateUniqueUsername(profile: GoogleUserProfile): Promise<string> {
        const rawName = (profile.name || profile.email.split("@")[0])
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_")
            .slice(0, 15);
        const base = rawName.length >= 3 ? rawName : `user_${Math.floor(100 + Math.random() * 900)}`;

        let candidate = base;
        let attempts = 0;
        while (await this.usersRepository.findOne({ where: { username: candidate }, withDeleted: true })) {
            candidate = `${base.slice(0, 10)}_${Math.floor(1000 + Math.random() * 9000)}`;
            attempts++;
            if (attempts > 15) break;
        }

        return candidate;
    }
}
