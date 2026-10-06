import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller.js";
import { ProductsService } from "./products.service.js";
import { ReviewsModule } from "../reviews/reviews.module.js";
import { Product } from "./product.entity.js";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [ReviewsModule, TypeOrmModule.forFeature([Product])],
})



export class ProductsModule { }