import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module.js";
import { ProductsModule } from "./products/products.module.js";
import { ReviewsModule } from "./reviews/reviews.module.js";
import { AppController } from "./app.controller.js";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "postgres",
            host: process.env.DB_HOST || "localhost",
            port: Number(process.env.DB_PORT) || 5432,
            username: process.env.DB_USER || "postgres",
            password: process.env.DB_PASSWORD || "postgres",
            database: process.env.DB_NAME || "learning_nest",
            autoLoadEntities: true,
            synchronize: true, // Only for development/learning
        }),
        UsersModule,
        ProductsModule,
        ReviewsModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
    