import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { ReviewsService } from "./reviews.service.js";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { AuthGuard } from "../users/guards/auth.guard.js";
import { CurrentUser } from "../users/decorators/current-user.decorator.js";
import type { JwtPayload } from "../utils/types.js";
import { Review } from "./review.entity.js";

@Controller("reviews")
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    getAllReviews(): Promise<Review[]> {
        return this.reviewsService.getAllReviews();
    }

    @Get(":id")
    getReviewById(@Param("id", ParseUUIDPipe) id: string): Promise<Review> {
        return this.reviewsService.getReviewById(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    createReview(
        @Body() body: CreateReviewDto,
        @CurrentUser() user: JwtPayload,
    ): Promise<Review> {
        return this.reviewsService.createReview(body, user.userId);
    }

    @Put(":id")
    updateReview(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() body: UpdateReviewDto
    ): Promise<Review> {
        return this.reviewsService.updateReview(id, body);
    }

    @Delete(":id")
    deleteReview(@Param("id", ParseUUIDPipe) id: string): Promise<{ message: string }> {
        return this.reviewsService.deleteReview(id);
    }
}
