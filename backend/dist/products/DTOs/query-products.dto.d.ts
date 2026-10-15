import { SortOrder } from "../../utils/enums.js";
import { PaginationDto } from "../../utils/pagination.dto.js";
export declare enum ProductSortBy {
    CREATED_AT = "createdAt",
    PRICE = "price",
    TITLE = "title"
}
export declare class QueryProductsDto extends PaginationDto {
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    userId?: string;
    sortBy?: ProductSortBy;
    sortOrder?: SortOrder;
}
