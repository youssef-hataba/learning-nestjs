import { IsOptional, IsString, IsNumber, Min, IsEnum, IsUUID } from "class-validator";
import { Type } from "class-transformer";

export enum ProductSortBy {
    CREATED_AT = "createdAt",
    PRICE = "price",
    TITLE = "title",
}

export enum SortOrder {
    ASC = "ASC",
    DESC = "DESC",
}

export class QueryProductsDto {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "minPrice must be a valid number" })
    @Min(0, { message: "minPrice must be greater than or equal to 0" })
    minPrice?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "maxPrice must be a valid number" })
    @Min(0, { message: "maxPrice must be greater than or equal to 0" })
    maxPrice?: number;

    @IsOptional()
    @IsUUID("all", { message: "userId must be a valid UUID" })
    userId?: string;

    @IsOptional()
    @IsEnum(ProductSortBy, { message: "sortBy must be one of: createdAt, price, title" })
    sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder, { message: "sortOrder must be ASC or DESC" })
    sortOrder?: SortOrder = SortOrder.DESC;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "page must be a valid number" })
    @Min(1, { message: "page must be at least 1" })
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    @IsNumber({}, { message: "limit must be a valid number" })
    @Min(1, { message: "limit must be at least 1" })
    limit?: number = 10;
}
