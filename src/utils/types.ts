import { UserType } from "./enums.js";

export type JwtPayload = {
    userId: string;
    userType: UserType;
};

export type JWTPayload = JwtPayload;
