import { SelectQueryBuilder } from "typeorm";
import { Product } from "../product.entity.js";
import { QueryProductsDto, ProductSortBy } from "../DTOs/query-products.dto.js";
import { SortOrder } from "../../utils/enums.js";

export const PRODUCT_SORT_FIELD_MAP: Record<ProductSortBy, string> = {
    [ProductSortBy.CREATED_AT]: "product.createdAt",
    [ProductSortBy.PRICE]: "product.price",
    [ProductSortBy.TITLE]: "product.title",
    [ProductSortBy.STOCK]: "product.stock",
};

/**
 * Applies search, price range, user, and plant-specific filters to a Product query builder.
 */
export function applyProductFilters(
    queryBuilder: SelectQueryBuilder<Product>,
    query: QueryProductsDto
): void {
    const {
        search,
        minPrice,
        maxPrice,
        userId,
        placement,
        lightRequirement,
        wateringFrequency,
        careLevel,
        isPetFriendly,
        category,
    } = query;

    if (search?.trim()) {
        queryBuilder.andWhere(
            "(product.title ILIKE :search OR product.description ILIKE :search OR product.scientificName ILIKE :search OR product.category ILIKE :search)",
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

    if (placement) {
        queryBuilder.andWhere("product.placement = :placement", { placement });
    }

    if (lightRequirement) {
        queryBuilder.andWhere("product.lightRequirement = :lightRequirement", { lightRequirement });
    }

    if (wateringFrequency) {
        queryBuilder.andWhere("product.wateringFrequency = :wateringFrequency", { wateringFrequency });
    }

    if (careLevel) {
        queryBuilder.andWhere("product.careLevel = :careLevel", { careLevel });
    }

    if (isPetFriendly !== undefined) {
        queryBuilder.andWhere("product.isPetFriendly = :isPetFriendly", { isPetFriendly });
    }

    if (category?.trim()) {
        queryBuilder.andWhere("product.category ILIKE :category", { category: `%${category.trim()}%` });
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
