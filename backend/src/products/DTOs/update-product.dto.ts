import { IsOptional, IsString, IsNumber, Min, Length, IsEnum, IsBoolean, IsInt } from "class-validator";
import { Type } from "class-transformer";
import { PlantPlacement, LightRequirement, WateringFrequency, CareLevel } from "../../utils/enums.js";

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @Length(3, 100, { message: "Title must be between 3 and 100 characters long" })
    title?: string;

    @IsOptional()
    @IsString()
    @Length(2, 100, { message: "Scientific name must be between 2 and 100 characters long" })
    scientificName?: string;

    @IsOptional()
    @IsString()
    @Length(5, 1000, { message: "Description must be between 5 and 1000 characters long" })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: "Price must be a number" })
    @Min(0, { message: "Price must be a positive number" })
    price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: "Stock must be an integer" })
    @Min(0, { message: "Stock cannot be negative" })
    stock?: number;

    @IsOptional()
    @IsEnum(PlantPlacement, { message: "Placement must be INDOOR, OUTDOOR, or BOTH" })
    placement?: PlantPlacement;

    @IsOptional()
    @IsEnum(LightRequirement, { message: "Light requirement must be LOW_LIGHT, INDIRECT_BRIGHT, or DIRECT_SUN" })
    lightRequirement?: LightRequirement;

    @IsOptional()
    @IsEnum(WateringFrequency, { message: "Watering frequency must be LOW, MODERATE, or HIGH" })
    wateringFrequency?: WateringFrequency;

    @IsOptional()
    @IsEnum(CareLevel, { message: "Care level must be EASY, MODERATE, or EXPERT" })
    careLevel?: CareLevel;

    @IsOptional()
    @IsBoolean({ message: "isPetFriendly must be a boolean" })
    isPetFriendly?: boolean;

    @IsOptional()
    @IsString()
    humidity?: string;

    @IsOptional()
    @IsString()
    potSize?: string;

    @IsOptional()
    @IsString()
    category?: string;
}