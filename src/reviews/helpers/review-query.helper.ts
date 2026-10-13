import { SelectQueryBuilder } from "typeorm";
import { Review } from "../review.entity.js";
import { QueryReviewsDto, ReviewSortBy } from "../DTOs/query-reviews.dto.js";
import { SortOrder } from "../../utils/enums.js";

export const REVIEW_SORT_FIELD_MAP: Record<ReviewSortBy, string> = {
    [ReviewSortBy.CREATED_AT]: "review.createdAt",
    [ReviewSortBy.RATING]: "review.rating",
};

/**
 * Applies search, rating range, productId, and userId filters to a Review query builder.
 */
export function applyReviewFilters(
    queryBuilder: SelectQueryBuilder<Review>,
    query: QueryReviewsDto
): void {
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

/**
 * Applies sorting safely using a whitelist field map.
 */
export function applyReviewSorting(
    queryBuilder: SelectQueryBuilder<Review>,
    sortBy: ReviewSortBy = ReviewSortBy.CREATED_AT,
    sortOrder: SortOrder = SortOrder.DESC
): void {
    const sortColumn = REVIEW_SORT_FIELD_MAP[sortBy] ?? REVIEW_SORT_FIELD_MAP[ReviewSortBy.CREATED_AT];
    const orderDirection = sortOrder === SortOrder.ASC ? "ASC" : "DESC";

    queryBuilder.orderBy(sortColumn, orderDirection);
}
