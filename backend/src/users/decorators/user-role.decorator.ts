import { SetMetadata } from "@nestjs/common";
import { UserType } from "../../utils/enums.js";

/** Metadata key used to attach and retrieve allowed roles */
export const ROLES_KEY = "roles";

/**
 * Custom decorator to attach required user roles to a route handler or controller class.
 *
 * @example
 * ```typescript
 * @Roles(UserType.ADMIN)
 * @UseGuards(AuthGuard, RolesGuard)
 * @Get('admin-only')
 * ```
 */
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);

export const UserRole = Roles;
export const UserRoles = Roles;
