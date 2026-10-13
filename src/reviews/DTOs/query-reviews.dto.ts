import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { SortOrder } from "../../utils/enums.js";
import { PaginationDto } from "../../utils/pagination.dto.js";

export enum ReviewSortBy {
    CREATED_AT = "createdAt",
    RATING = "rating",
}

export class QueryReviewsDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "rating must be a valid number" })
    @Min(1, { message: "rating must be at least 1" })
    @Max(5, { message: "rating cannot exceed 5" })
    rating?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "minRating must be a valid number" })
    @Min(1, { message: "minRating must be at least 1" })
    @Max(5, { message: "minRating cannot exceed 5" })
    minRating?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "maxRating must be a valid number" })
    @Min(1, { message: "maxRating must be at least 1" })
    @Max(5, { message: "maxRating cannot exceed 5" })
    maxRating?: number;

    @IsOptional()
    @IsUUID("all", { message: "productId must be a valid UUID" })
    productId?: string;

    @IsOptional()
    @IsUUID("all", { message: "userId must be a valid UUID" })
    userId?: string;

    @IsOptional()
    @IsEnum(ReviewSortBy, { message: "sortBy must be one of: createdAt, rating" })
    sortBy?: ReviewSortBy = ReviewSortBy.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder, { message: "sortOrder must be ASC or DESC" })
    sortOrder?: SortOrder = SortOrder.DESC;
}

