import { Controller, Get } from "@nestjs/common";

@Controller()
export class ReviewsController {
    @Get("reviews")
    getAllReviews() {
        return [
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
        ]
    }
}

