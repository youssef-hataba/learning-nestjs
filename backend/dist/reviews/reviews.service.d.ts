import { Repository } from "typeorm";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { QueryReviewsDto } from "./DTOs/query-reviews.dto.js";
import { Review } from "./review.entity.js";
import { ProductsService } from "../products/products.service.js";
import type { JwtPayload, PaginatedResult } from "../utils/types.js";
export type PaginatedReviewsResponse = PaginatedResult<Review>;
export declare class ReviewsService {
    private readonly reviewsRepository;
    private readonly productsService;
    constructor(reviewsRepository: Repository<Review>, productsService: ProductsService);
    getAllReviews(query?: QueryReviewsDto): Promise<PaginatedResult<Review>>;
    getReviewById(id: string): Promise<Review>;
    createReview(body: CreateReviewDto, userId: string): Promise<Review>;
    updateReview(id: string, body: UpdateReviewDto, user: JwtPayload): Promise<Review>;
    deleteReview(id: string, user: JwtPayload): Promise<{
        message: string;
    }>;
}
