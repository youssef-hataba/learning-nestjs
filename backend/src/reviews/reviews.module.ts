import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ReviewsController } from "./reviews.controller.js";
import { ReviewsService } from "./reviews.service.js";
import { Review } from "./review.entity.js";
import { UsersModule } from "../users/users.module.js";
import { ProductsModule } from "../products/products.module.js";

@Module({
    imports: [
        TypeOrmModule.forFeature([Review]),
        UsersModule,
        ProductsModule,
    ],
    controllers: [ReviewsController],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule { }