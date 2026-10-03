import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module.js";
import { ProductsModule } from "./products/products.module.js";
import { ReviewsModule } from "./reviews/reviews.module.js";
import { AppController } from "./app.controller.js";


@Module({
    imports: [UsersModule, ProductsModule, ReviewsModule],
    controllers: [AppController],
})
export class AppModule { }
    