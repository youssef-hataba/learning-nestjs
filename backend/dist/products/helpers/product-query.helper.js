import { ProductSortBy } from "../DTOs/query-products.dto.js";
import { SortOrder } from "../../utils/enums.js";
export const PRODUCT_SORT_FIELD_MAP = {
    [ProductSortBy.CREATED_AT]: "product.createdAt",
    [ProductSortBy.PRICE]: "product.price",
    [ProductSortBy.TITLE]: "product.title",
};
export function applyProductFilters(queryBuilder, query) {
    const { search, minPrice, maxPrice, userId } = query;
    if (search?.trim()) {
        queryBuilder.andWhere("(product.title ILIKE :search OR product.description ILIKE :search)", { search: `%${search.trim()}%` });
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
export function applyProductSorting(queryBuilder, sortBy = ProductSortBy.CREATED_AT, sortOrder = SortOrder.DESC) {
    const sortColumn = PRODUCT_SORT_FIELD_MAP[sortBy] ?? PRODUCT_SORT_FIELD_MAP[ProductSortBy.CREATED_AT];
    const orderDirection = sortOrder === SortOrder.ASC ? "ASC" : "DESC";
    queryBuilder.orderBy(sortColumn, orderDirection);
}
//# sourceMappingURL=product-query.helper.js.map