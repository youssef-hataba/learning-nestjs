import { ReviewsService } from "./reviews.service.js";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { QueryReviewsDto } from "./DTOs/query-reviews.dto.js";
import type { JwtPayload, PaginatedResult } from "../utils/types.js";
import { Review } from "./review.entity.js";
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    getAllReviews(query: QueryReviewsDto): Promise<PaginatedResult<Review>>;
    getReviewById(id: string): Promise<Review>;
    createReview(body: CreateReviewDto, user: JwtPayload): Promise<Review>;
    updateReview(id: string, body: UpdateReviewDto, user: JwtPayload): Promise<Review>;
    deleteReview(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
