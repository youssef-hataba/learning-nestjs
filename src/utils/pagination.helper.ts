import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { PaginationMeta } from "./types.js";

/**
 * Applies pagination (skip and take) to a TypeORM SelectQueryBuilder.
 */
export function applyPagination<T extends ObjectLiteral>(
    queryBuilder: SelectQueryBuilder<T>,
    page: number,
    limit: number
): void {
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
}

/**
 * Constructs a standardized pagination metadata object.
 */
export function buildPaginationMeta(
    total: number,
    page: number,
    limit: number
): PaginationMeta {
    const totalPages = Math.ceil(total / limit);

    return {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
    };
}
