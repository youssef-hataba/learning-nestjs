import { IsNotEmpty, IsString, IsNumber, Min, Max, Length } from "class-validator";

export class CreateReviewDto {
    @IsString()
    @IsNotEmpty({ message: "Review text is required" })
    @Length(3, 200, { message: "Review text must be between 3 and 200 characters long" })
    text: string;

    @IsNumber({}, { message: "Rating must be a number" })
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating cannot exceed 5" })
    rating: number;
}
