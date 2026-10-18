import { IsOptional, IsString, IsNumber, Min, IsEnum, IsUUID, IsBoolean } from "class-validator";
import { Type, Transform } from "class-transformer";
import { SortOrder, PlantPlacement, LightRequirement, WateringFrequency, CareLevel } from "../../utils/enums.js";
import { PaginationDto } from "../../utils/pagination.dto.js";

export enum ProductSortBy {
    CREATED_AT = "createdAt",
    PRICE = "price",
    TITLE = "title",
    STOCK = "stock",
}

export class QueryProductsDto extends PaginationDto {
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
    @IsEnum(PlantPlacement, { message: "placement must be INDOOR, OUTDOOR, or BOTH" })
    placement?: PlantPlacement;

    @IsOptional()
    @IsEnum(LightRequirement, { message: "lightRequirement must be LOW_LIGHT, INDIRECT_BRIGHT, or DIRECT_SUN" })
    lightRequirement?: LightRequirement;

    @IsOptional()
    @IsEnum(WateringFrequency, { message: "wateringFrequency must be LOW, MODERATE, or HIGH" })
    wateringFrequency?: WateringFrequency;

    @IsOptional()
    @IsEnum(CareLevel, { message: "careLevel must be EASY, MODERATE, or EXPERT" })
    careLevel?: CareLevel;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === "true" || value === true) return true;
        if (value === "false" || value === false) return false;
        return value;
    })
    @IsBoolean({ message: "isPetFriendly must be true or false" })
    isPetFriendly?: boolean;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsEnum(ProductSortBy, { message: "sortBy must be one of: createdAt, price, title, stock" })
    sortBy?: ProductSortBy = ProductSortBy.CREATED_AT;

    @IsOptional()
    @IsEnum(SortOrder, { message: "sortOrder must be ASC or DESC" })
    sortOrder?: SortOrder = SortOrder.DESC;
}
