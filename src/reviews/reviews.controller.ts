import { Body, Controller, Get, Param, Post, Put, Delete, ParseIntPipe } from "@nestjs/common";
import { ReviewsService } from "./reviews.service.js";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";

@Controller("reviews")
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    getAllReviews() {
        return this.reviewsService.getAllReviews();
    }

    @Get(":id")
    getReviewById(@Param("id", ParseIntPipe) id: number) {
        return this.reviewsService.getReviewById(id);
    }

    @Post()
    createReview(@Body() body: CreateReviewDto) {
        return this.reviewsService.createReview(body);
    }

    @Put(":id")
    updateReview(
        @Param("id", ParseIntPipe) id: number,
        @Body() body: UpdateReviewDto
    ) {
        return this.reviewsService.updateReview(id, body);
    }

    @Delete(":id")
    deleteReview(@Param("id", ParseIntPipe) id: number) {
        return this.reviewsService.deleteReview(id);
    }
}
