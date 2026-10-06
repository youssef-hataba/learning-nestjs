import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller.js";
import { ProductsService } from "./products.service.js";
import { ReviewsModule } from "../reviews/reviews.module.js";

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [ReviewsModule],
})

export class ProductsModule { }