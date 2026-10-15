import { SelectQueryBuilder } from "typeorm";
import { Review } from "../review.entity.js";
import { QueryReviewsDto, ReviewSortBy } from "../DTOs/query-reviews.dto.js";
import { SortOrder } from "../../utils/enums.js";
export declare const REVIEW_SORT_FIELD_MAP: Record<ReviewSortBy, string>;
export declare function applyReviewFilters(queryBuilder: SelectQueryBuilder<Review>, query: QueryReviewsDto): void;
export declare function applyReviewSorting(queryBuilder: SelectQueryBuilder<Review>, sortBy?: ReviewSortBy, sortOrder?: SortOrder): void;
