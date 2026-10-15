import { ReviewSortBy } from "../DTOs/query-reviews.dto.js";
import { SortOrder } from "../../utils/enums.js";
export const REVIEW_SORT_FIELD_MAP = {
    [ReviewSortBy.CREATED_AT]: "review.createdAt",
    [ReviewSortBy.RATING]: "review.rating",
};
export function applyReviewFilters(queryBuilder, query) {
    const { search, rating, minRating, maxRating, productId, userId } = query;
    if (search?.trim()) {
        queryBuilder.andWhere("review.comment ILIKE :search", {
            search: `%${search.trim()}%`,
        });
    }
    if (rating !== undefined) {
        queryBuilder.andWhere("review.rating = :rating", { rating });
    }
    if (minRating !== undefined) {
        queryBuilder.andWhere("review.rating >= :minRating", { minRating });
    }
    if (maxRating !== undefined) {
        queryBuilder.andWhere("review.rating <= :maxRating", { maxRating });
    }
    if (productId) {
        queryBuilder.andWhere("product.id = :productId", { productId });
    }
    if (userId) {
        queryBuilder.andWhere("user.id = :userId", { userId });
    }
}
export function applyReviewSorting(queryBuilder, sortBy = ReviewSortBy.CREATED_AT, sortOrder = SortOrder.DESC) {
    const sortColumn = REVIEW_SORT_FIELD_MAP[sortBy] ?? REVIEW_SORT_FIELD_MAP[ReviewSortBy.CREATED_AT];
    const orderDirection = sortOrder === SortOrder.ASC ? "ASC" : "DESC";
    queryBuilder.orderBy(sortColumn, orderDirection);
}
//# sourceMappingURL=review-query.helper.js.map