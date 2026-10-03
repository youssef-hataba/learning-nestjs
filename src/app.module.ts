import { Module } from "@nestjs/common";
import { UsersModule } from "./users/users.module.js";
import { ProductsModule } from "./products/products.module.js";
import { ReviewsModule } from "./reviews/reviews.module.js";


@Module({
    imports: [UsersModule, ProductsModule, ReviewsModule],
})
export class AppModule { }
