import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { Review } from "./review.entity.js";
import { User } from "../users/user.entity.js";
import { ProductsService } from "../products/products.service.js";

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
        private readonly productsService: ProductsService,
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
            throw new NotFoundException(`Review with ID "${id}" not found`);
        }
        return review;
    }

    async createReview(body: CreateReviewDto, userId: string): Promise<Review> {
        // Validate that the product exists (throws NotFoundException if not found)
        const product = await this.productsService.getProductById(body.productId);

        const newReview = this.reviewsRepository.create({
            rating: body.rating,
            comment: body.comment,
            product,
            user: { id: userId } as User,
        });
        return await this.reviewsRepository.save(newReview);
    }

    async updateReview(id: string, body: UpdateReviewDto): Promise<Review> {
        const review = await this.getReviewById(id);
        Object.assign(review, body);
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
