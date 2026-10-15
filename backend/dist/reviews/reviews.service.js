var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { QueryReviewsDto } from "./DTOs/query-reviews.dto.js";
import { Review } from "./review.entity.js";
import { ProductsService } from "../products/products.service.js";
import { UserType } from "../utils/enums.js";
import { applyPagination, buildPaginationMeta } from "../utils/pagination.helper.js";
import { applyReviewFilters, applyReviewSorting } from "./helpers/review-query.helper.js";
let ReviewsService = class ReviewsService {
    reviewsRepository;
    productsService;
    constructor(reviewsRepository, productsService) {
        this.reviewsRepository = reviewsRepository;
        this.productsService = productsService;
    }
    async getAllReviews(query = new QueryReviewsDto()) {
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
    async getReviewById(id) {
        const review = await this.reviewsRepository.findOne({
            where: { id },
            relations: { product: true, user: true },
        });
        if (!review) {
            throw new NotFoundException(`Review with ID "${id}" not found`);
        }
        return review;
    }
    async createReview(body, userId) {
        const product = await this.productsService.getProductById(body.productId);
        const newReview = this.reviewsRepository.create({
            rating: body.rating,
            comment: body.comment,
            product,
            user: { id: userId },
        });
        return await this.reviewsRepository.save(newReview);
    }
    async updateReview(id, body, user) {
        const review = await this.getReviewById(id);
        if (review.user.id !== user.userId) {
            throw new ForbiddenException("You are only allowed to update your own review");
        }
        Object.assign(review, body);
        return await this.reviewsRepository.save(review);
    }
    async deleteReview(id, user) {
        const review = await this.getReviewById(id);
        if (review.user.id !== user.userId && user.userType !== UserType.ADMIN) {
            throw new ForbiddenException("You are not allowed to delete this review");
        }
        await this.reviewsRepository.remove(review);
        return {
            message: "Review deleted successfully",
        };
    }
};
ReviewsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Review)),
    __metadata("design:paramtypes", [Repository,
        ProductsService])
], ReviewsService);
export { ReviewsService };
//# sourceMappingURL=reviews.service.js.map