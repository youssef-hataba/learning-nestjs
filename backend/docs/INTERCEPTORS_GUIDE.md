# NestJS Interceptors Architecture & Engineering Guide

> **Document Type:** Technical & Engineering Guide  
> **Status:** Active / Reference  
> **Subject:** Aspect-Oriented Programming (AOP), Lifecycle Placement, RxJS CallHandlers & Real-World Use Cases  

---

## 1. What is an Interceptor?

An **Interceptor** in NestJS is a class annotated with `@Injectable()` that implements the `NestInterceptor` interface. Interceptors are inspired by **Aspect-Oriented Programming (AOP)** techniques.

### The Superpower of Interceptors:
Unlike Guards (which only inspect incoming requests) or Exception Filters (which only catch outgoing errors), an Interceptor is the **only building block in NestJS that wraps BOTH the request and the response lifecycle**:
- **Before Execution:** Can inspect, mutate, or log the incoming request before the route handler is invoked.
- **After Execution:** Can transform, cache, log, or mutate the returned result (or error) before it is sent back to the client.

```mermaid
graph LR
    Incoming[Incoming Request] --> InterceptorBefore[Interceptor: Before Handler]
    InterceptorBefore --> Handler[Controller Handler & Service Execution]
    Handler --> InterceptorAfter[Interceptor: After Handler via RxJS .pipe]
    InterceptorAfter --> Outgoing[Outgoing Response to Client]
```

---

## 2. Where do Interceptors run in the NestJS Request Lifecycle?

To master NestJS architecture, you must understand the exact sequence in which incoming requests flow through the framework:

```text
1. Incoming HTTP Request
      │
2. Global / Route Middlewares (Express level)
      │
3. Guards (AuthGuard, RolesGuard: Authentication & Authorization)
      │
4. Interceptors (Pre-Controller logic) ◄── [STAGE 1]
      │
5. Pipes (ValidationPipe, ParseUUIDPipe: Data validation & transformation)
      │
6. Controller Handler & Services (Core business logic execution)
      │
7. Interceptors (Post-Controller logic via RxJS operators) ◄── [STAGE 2]
      │
8. Exception Filters (Catches any unhandled errors)
      │
9. Final Response to Client
```

---

## 3. How Interceptors Work Under the Hood (`CallHandler` & RxJS)

Every interceptor must implement the `intercept` method:

```typescript
intercept(context: ExecutionContext, next: CallHandler): Observable<any>
```

### The Two Core Parameters:
1. **`ExecutionContext`:** Provides access to the current HTTP `Request` and `Response` objects, as well as metadata about the controller class and handler method.
2. **`CallHandler`:** Contains the method `next.handle()`.
   - If you **do not call** `next.handle()`, the controller handler **will never execute** (useful for cache-hit intercepts).
   - Calling `next.handle()` invokes the route handler and returns an **RxJS `Observable`** stream containing the return value of your controller.

---

## 4. The 5 Most Popular & Real-World Use Cases

### 4.1 Use Case 1: Execution Time Profiling & Request Logging
Measures execution duration in milliseconds to monitor slow database queries or slow external API calls.

```typescript
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url } = request;
        const now = Date.now();

        this.logger.log(`Incoming Request: ${method} ${url}`);

        return next.handle().pipe(
            tap(() => {
                const elapsed = Date.now() - now;
                this.logger.log(`Completed Request: ${method} ${url} - Finished in ${elapsed}ms`);
            }),
        );
    }
}
```

---

### 4.2 Use Case 2: Standardizing API Response Format (Response Normalization)
Transforms varied controller returns (e.g., arrays, objects, strings) into a uniform enterprise JSON structure.

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export interface StandardResponse<T> {
    success: boolean;
    statusCode: number;
    timestamp: string;
    data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, StandardResponse<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<StandardResponse<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();

        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode: response.statusCode,
                timestamp: new Date().toISOString(),
                data: data ?? null,
            })),
        );
    }
}
```
**Client Receives:**
```json
{
  "success": true,
  "statusCode": 200,
  "timestamp": "2026-10-13T16:00:00.000Z",
  "data": [ { "id": "1", "username": "ahmed" } ]
}
```

---

### 4.3 Use Case 3: Request Timeout Management
Cancels any request that takes longer than a specified duration (e.g., 5 seconds) to prevent hanging connections.

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { Observable, TimeoutError, throwError } from "rxjs";
import { catchError, timeout } from "rxjs/operators";

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            timeout(5000), // Cancel if takes > 5000ms
            catchError((err) => {
                if (err instanceof TimeoutError) {
                    return throwError(() => new RequestTimeoutException("Request processing timed out after 5 seconds"));
                }
                return throwError(() => err);
            }),
        );
    }
}
```

---

### 4.4 Use Case 4: Sensitive Data Sanitization (Excluding Passwords)
NestJS includes a built-in interceptor called `ClassSerializerInterceptor`.
When applied, any entity property marked with `@Exclude()` (like passwords or reset tokens) is automatically stripped from the outgoing JSON response:

```typescript
// In main.ts or Controller:
app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
```

---

### 4.5 Use Case 5: In-Memory / Redis Response Caching
Bypasses the database entirely if a cached response already exists for the requested route.

```typescript
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, of } from "rxjs";

@Injectable()
export class SimpleCacheInterceptor implements NestInterceptor {
    private readonly cache = new Map<string, any>();

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const cacheKey = request.url;

        // 1. Cache Hit: return cached data immediately (skips Controller)
        if (this.cache.has(cacheKey)) {
            return of(this.cache.get(cacheKey));
        }

        // 2. Cache Miss: call handler and store result for future requests
        return next.handle().pipe(
            tap((data) => this.cache.set(cacheKey, data)),
        );
    }
}
```

---

## 5. How to Apply Interceptors (Binding Scopes)

### 1. Single Route Scope:
```typescript
@Get('products')
@UseInterceptors(LoggingInterceptor)
getProducts() { ... }
```

### 2. Controller-Wide Scope:
```typescript
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UsersController { ... }
```

### 3. Global Application-Wide Scope:
Inside `main.ts`:
```typescript
app.useGlobalInterceptors(new LoggingInterceptor());
```
Or via Dependency Injection in `AppModule`:
```typescript
{
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
}
```

---

## 6. Comparison Cheat Sheet: NestJS Components

| Component | Interface | Executes | Primary Responsibility | Can modify Response? |
| :--- | :--- | :--- | :--- | :--- |
| **Middleware** | `NestMiddleware` | First | Raw Express request manipulation, headers, CORS, body-parsing | Yes (raw Express) |
| **Guard** | `CanActivate` | Second | Authentication & Authorization (allow or deny request) | No (returns `true` or `false`) |
| **Interceptor** | `NestInterceptor` | **Before & After** | Wrap execution, measure duration, transform response, cache, timeout | **Yes (Full RxJS stream)** |
| **Pipe** | `PipeTransform` | Third | Input validation (class-validator) & type coercion | No (transforms input arguments) |
| **Filter** | `ExceptionFilter` | On Error | Catches uncaught exceptions and formats error JSON | Yes (formats error response) |
