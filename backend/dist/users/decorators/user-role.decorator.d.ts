import { UserType } from "../../utils/enums.js";
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: UserType[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const UserRole: (...roles: UserType[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const UserRoles: (...roles: UserType[]) => import("@nestjs/common").CustomDecorator<string>;
