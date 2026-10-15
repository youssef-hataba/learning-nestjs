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
import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, UseGuards, Query } from "@nestjs/common";
import { ReviewsService } from "./reviews.service.js";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { QueryReviewsDto } from "./DTOs/query-reviews.dto.js";
import { AuthGuard } from "../users/guards/auth.guard.js";
import { CurrentUser } from "../users/decorators/current-user.decorator.js";
let ReviewsController = class ReviewsController {
    reviewsService;
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    getAllReviews(query) {
        return this.reviewsService.getAllReviews(query);
    }
    getReviewById(id) {
        return this.reviewsService.getReviewById(id);
    }
    createReview(body, user) {
        return this.reviewsService.createReview(body, user.userId);
    }
    updateReview(id, body, user) {
        return this.reviewsService.updateReview(id, body, user);
    }
    deleteReview(id, user) {
        return this.reviewsService.deleteReview(id, user);
    }
};
__decorate([
    Get(),
    __param(0, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [QueryReviewsDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getAllReviews", null);
__decorate([
    Get(":id"),
    __param(0, Param("id", ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getReviewById", null);
__decorate([
    Post(),
    UseGuards(AuthGuard),
    __param(0, Body()),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "createReview", null);
__decorate([
    Put(":id"),
    UseGuards(AuthGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __param(1, Body()),
    __param(2, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateReviewDto, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "updateReview", null);
__decorate([
    Delete(":id"),
    UseGuards(AuthGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __param(1, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "deleteReview", null);
ReviewsController = __decorate([
    Controller("reviews"),
    __metadata("design:paramtypes", [ReviewsService])
], ReviewsController);
export { ReviewsController };
//# sourceMappingURL=reviews.controller.js.map