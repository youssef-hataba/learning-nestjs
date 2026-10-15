import { SetMetadata } from "@nestjs/common";
export const ROLES_KEY = "roles";
export const Roles = (...roles) => SetMetadata(ROLES_KEY, roles);
export const UserRole = Roles;
export const UserRoles = Roles;
//# sourceMappingURL=user-role.decorator.js.map