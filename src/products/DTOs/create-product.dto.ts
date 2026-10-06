import { IsNotEmpty, IsString, IsNumber, Min, Length } from "class-validator";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(3, 30, { message: "Title must be between 3 and 30 characters long" })
    title: string;

    @IsString()
    @IsNotEmpty()
    @Length(5, 500, { message: "Description must be between 5 and 500 characters long" })
    description: string;

    // 1st arg: number options (e.g., decimals), 2nd arg: validation options (e.g., message)
    @IsNumber({}, { message: "Price must be a number" })
    @IsNotEmpty({ message: "Price is required" })
    @Min(0, { message: "Price must be a positive number" })
    price: number;
}