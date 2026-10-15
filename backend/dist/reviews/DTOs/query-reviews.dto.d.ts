import { SortOrder } from "../../utils/enums.js";
import { PaginationDto } from "../../utils/pagination.dto.js";
export declare enum ReviewSortBy {
    CREATED_AT = "createdAt",
    RATING = "rating"
}
export declare class QueryReviewsDto extends PaginationDto {
    search?: string;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    productId?: string;
    userId?: string;
    sortBy?: ReviewSortBy;
    sortOrder?: SortOrder;
}
