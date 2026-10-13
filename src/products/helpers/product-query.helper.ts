import { SelectQueryBuilder } from "typeorm";
import { Product } from "../product.entity.js";
import { QueryProductsDto, ProductSortBy, SortOrder } from "../DTOs/query-products.dto.js";

export const PRODUCT_SORT_FIELD_MAP: Record<ProductSortBy, string> = {
    [ProductSortBy.CREATED_AT]: "product.createdAt",
    [ProductSortBy.PRICE]: "product.price",
    [ProductSortBy.TITLE]: "product.title",
};

/**
 * Applies search, price range, and user filters to a Product query builder.
 */
export function applyProductFilters(
    queryBuilder: SelectQueryBuilder<Product>,
    query: QueryProductsDto
): void {
    const { search, minPrice, maxPrice, userId } = query;

    if (search?.trim()) {
        queryBuilder.andWhere(
            "(product.title ILIKE :search OR product.description ILIKE :search)",
            { search: `%${search.trim()}%` }
        );
    }

    if (minPrice !== undefined) {
        queryBuilder.andWhere("product.price >= :minPrice", { minPrice });
    }

    if (maxPrice !== undefined) {
        queryBuilder.andWhere("product.price <= :maxPrice", { maxPrice });
    }

    if (userId) {
        queryBuilder.andWhere("user.id = :userId", { userId });
    }
}

/**
 * Applies sorting safely using a whitelist field map.
 */
export function applyProductSorting(
    queryBuilder: SelectQueryBuilder<Product>,
    sortBy: ProductSortBy = ProductSortBy.CREATED_AT,
    sortOrder: SortOrder = SortOrder.DESC
): void {
    const sortColumn = PRODUCT_SORT_FIELD_MAP[sortBy] ?? PRODUCT_SORT_FIELD_MAP[ProductSortBy.CREATED_AT];
    const orderDirection = sortOrder === SortOrder.ASC ? "ASC" : "DESC";

    queryBuilder.orderBy(sortColumn, orderDirection);
}
