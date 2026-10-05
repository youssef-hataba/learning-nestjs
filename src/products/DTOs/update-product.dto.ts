import { IsOptional, IsString, IsNumber, Min, Length } from "class-validator";

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @Length(3, 30, { message: "Name must be between 3 and 30 characters long" })
    name?: string;

    @IsOptional()
    @IsNumber({}, { message: "Price must be a number" })
    @Min(0, { message: "Price must be a positive number" })
    price?: number;
}