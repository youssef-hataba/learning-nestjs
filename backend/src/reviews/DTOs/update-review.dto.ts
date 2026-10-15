import { IsOptional, IsString, IsNumber, Min, Max, Length } from "class-validator";

export class UpdateReviewDto {
    @IsOptional()
    @IsNumber({}, { message: "Rating must be a number" })
    @Min(1, { message: "Rating must be at least 1" })
    @Max(5, { message: "Rating cannot exceed 5" })
    rating?: number;

    @IsOptional()
    @IsString()
    @Length(3, 300, { message: "Comment must be between 3 and 300 characters long" })
    comment?: string;
}
