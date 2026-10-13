import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, UseGuards, Query } from "@nestjs/common";
import { ReviewsService } from "./reviews.service.js";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";
import { QueryReviewsDto } from "./DTOs/query-reviews.dto.js";
import { AuthGuard } from "../users/guards/auth.guard.js";
import { CurrentUser } from "../users/decorators/current-user.decorator.js";
import type { JwtPayload, PaginatedResult } from "../utils/types.js";
import { Review } from "./review.entity.js";

@Controller("reviews")
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    getAllReviews(@Query() query: QueryReviewsDto): Promise<PaginatedResult<Review>> {
        return this.reviewsService.getAllReviews(query);
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
    @UseGuards(AuthGuard)
    updateReview(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() body: UpdateReviewDto,
        @CurrentUser() user: JwtPayload,
    ): Promise<Review> {
        return this.reviewsService.updateReview(id, body, user);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    deleteReview(
        @Param("id", ParseUUIDPipe) id: string,
        @CurrentUser() user: JwtPayload,
    ): Promise<{ message: string }> {
        return this.reviewsService.deleteReview(id, user);
    }
}
