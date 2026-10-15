import { IsOptional, IsString, IsNumber, Min, Length } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @Length(3, 30, { message: "Title must be between 3 and 30 characters long" })
    title?: string;

    @IsOptional()
    @IsString()
    @Length(5, 500, { message: "Description must be between 5 and 500 characters long" })
    description?: string;

    @IsOptional()
    @IsNumber({}, { message: "Price must be a number" })
    @Min(0, { message: "Price must be a positive number" })
    price?: number;
}