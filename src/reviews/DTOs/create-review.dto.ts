import { IsNotEmpty, IsString, IsNumber, Min, Max, Length, IsUUID } from "class-validator";

export class CreateReviewDto {
    @IsNumber({}, { message: "Rating must be a number" })
    @IsNotEmpty({ message: "Rating is required" })
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating cannot exceed 5" })
    rating: number;

    @IsString()
    @IsNotEmpty({ message: "Comment is required" })
    @Length(3, 300, { message: "Comment must be between 3 and 300 characters long" })
    comment: string;

    @IsNotEmpty({ message: "productId is required" })
    @IsUUID("all", { message: "productId must be a valid UUID" })
    productId: string;
}

