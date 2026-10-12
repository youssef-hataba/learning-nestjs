import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/user-role.decorator.js";
import { UserType } from "../../utils/enums.js";
import { AuthenticatedRequest } from "./auth.guard.js";

/**
 * RolesGuard verifies whether the authenticated user possesses the required role(s)
 * specified by the `@Roles()` decorator.
 *
 * Execution order: Should follow `AuthGuard` in `@UseGuards(AuthGuard, RolesGuard)`.
 *
 * - Fail-Safe Policy: Throws `InternalServerErrorException` if `@Roles()` was forgotten on an endpoint protected by this guard.
 * - Authorized: Returns `true` if user's role matches required roles.
 * - Unauthorized: Returns `false` (NestJS throws `403 Forbidden`).
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Fail-Safe: If RolesGuard was applied, @Roles(...) MUST be explicitly declared
        if (!requiredRoles || requiredRoles.length === 0) {
            const handlerName = context.getHandler().name;
            throw new InternalServerErrorException(
                `Developer Error: RolesGuard is applied to '${handlerName}', but no roles are defined using the @Roles() decorator.`
            );
        }

        const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
        const user = request.user;

        if (!user || !user.userType) {
            return false;
        }

        return requiredRoles.includes(user.userType);
    }
}
