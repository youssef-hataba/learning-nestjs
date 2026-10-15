import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { QueryReviewsDto } from "./DTOs/query-reviews.dto.js";
import { Review } from "./review.entity.js";
import { User } from "../users/user.entity.js";
import { ProductsService } from "../products/products.service.js";
import { UserType } from "../utils/enums.js";
import type { JwtPayload, PaginatedResult } from "../utils/types.js";
import { applyPagination, buildPaginationMeta } from "../utils/pagination.helper.js";
import { applyReviewFilters, applyReviewSorting } from "./helpers/review-query.helper.js";

export type PaginatedReviewsResponse = PaginatedResult<Review>;

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewsRepository: Repository<Review>,
        private readonly productsService: ProductsService,
    ) {}

    async getAllReviews(query: QueryReviewsDto = new QueryReviewsDto()): Promise<PaginatedResult<Review>> {
        const { page = 1, limit = 10 } = query;

        const queryBuilder = this.reviewsRepository
            .createQueryBuilder("review")
            .leftJoinAndSelect("review.product", "product")
            .leftJoinAndSelect("review.user", "user");

        applyReviewFilters(queryBuilder, query);
        applyReviewSorting(queryBuilder, query.sortBy, query.sortOrder);
        applyPagination(queryBuilder, page, limit);

        const [items, total] = await queryBuilder.getManyAndCount();

        return {
            data: items,
            meta: buildPaginationMeta(total, page, limit),
        };
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

    async updateReview(id: string, body: UpdateReviewDto, user: JwtPayload): Promise<Review> {
        const review = await this.getReviewById(id);

        // Only the review creator can edit their opinion/review (admins can moderate/delete, but cannot modify someone's review)
        if (review.user.id !== user.userId) {
            throw new ForbiddenException("You are only allowed to update your own review");
        }

        Object.assign(review, body);
        return await this.reviewsRepository.save(review);
    }

    async deleteReview(id: string, user: JwtPayload): Promise<{ message: string }> {
        const review = await this.getReviewById(id);

        // Check ownership or admin privilege
        if (review.user.id !== user.userId && user.userType !== UserType.ADMIN) {
            throw new ForbiddenException("You are not allowed to delete this review");
        }

        await this.reviewsRepository.remove(review);
        return {
            message: "Review deleted successfully",
        };
    }
}
