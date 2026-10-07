import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { Review } from "./review.entity.js";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
    ) {}

    async getAllReviews(): Promise<Review[]> {
        return await this.reviewsRepository.find({
            relations: { product: true, user: true },
        });
    }

    async getReviewById(id: string): Promise<Review> {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: { product: true, user: true },
        });
        if (!review) {
            throw new NotFoundException("Review not found");
        }
        return review;
    }

    async createReview(body: CreateReviewDto): Promise<Review> {
        const newReview = this.reviewsRepository.create({
            rating: body.rating,
            comment: body.comment,
            product: body.productId ? ({ id: body.productId } as any) : undefined,
            user: body.userId ? ({ id: body.userId } as any) : undefined,
        });
        return await this.reviewsRepository.save(newReview);
    }

    async updateReview(id: string, body: UpdateReviewDto): Promise<Review> {
        const review = await this.getReviewById(id);
        review.rating = body.rating ?? review.rating;
        review.comment = body.comment ?? review.comment;
        return await this.reviewsRepository.save(review);
    }

    async deleteReview(id: string): Promise<{ message: string }> {
        const review = await this.getReviewById(id);
        await this.reviewsRepository.remove(review);
        return {
            message: "Review deleted successfully",
        };
    }
}
