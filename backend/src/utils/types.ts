import { UserType } from "./enums.js";

export type JwtPayload = {
    userId: string;
    userType: UserType;
};

export type JWTPayload = JwtPayload;

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface PaginatedResult<T> {
    data: T[];
    meta: PaginationMeta;
}
