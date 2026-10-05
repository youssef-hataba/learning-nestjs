import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateReviewDto } from "./DTOs/create-review.dto.js";
import { UpdateReviewDto } from "./DTOs/update-review.dto.js";

export type Review = {
    id: number;
    text: string;
    rating: number;
};

@Injectable()
export class ReviewsService {
    private reviews: Review[] = [
        {
            id: 1,
            text: "Review 1",
            rating: 5,
        },
        {
            id: 2,
            text: "Review 2",
            rating: 4,
        },
    ];

    getAllReviews(): Review[] {
        return this.reviews;
    }

    getReviewById(id: number): Review {
        const review = this.reviews.find(r => r.id === id);
        if (!review) {
            throw new NotFoundException("Review not found");
        }
        return review;
    }

    createReview(body: CreateReviewDto): Review {
        const newReview: Review = {
            id: this.reviews.length + 1,
            text: body.text,
            rating: body.rating,
        };
        this.reviews.push(newReview);
        return newReview;
    }

    updateReview(id: number, body: UpdateReviewDto): Review {
        const review = this.reviews.find(r => r.id === id);
        if (!review) {
            throw new NotFoundException("Review not found");
        }
        review.text = body.text ?? review.text;
        review.rating = body.rating ?? review.rating;
        return review;
    }

    deleteReview(id: number) {
        const review = this.reviews.find(r => r.id === id);
        if (!review) {
            throw new NotFoundException("Review not found");
        }
        this.reviews = this.reviews.filter(r => r.id !== id);
        return {
            message: "Review deleted successfully",
        };
    }
}
