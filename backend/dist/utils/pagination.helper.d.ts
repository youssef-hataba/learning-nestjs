import { ObjectLiteral, SelectQueryBuilder } from "typeorm";
import { PaginationMeta } from "./types.js";
export declare function applyPagination<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, page: number, limit: number): void;
export declare function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
