import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module.js";
import { ProductsModule } from "./products/products.module.js";
import { ReviewsModule } from "./reviews/reviews.module.js";
import { AppController } from "./app.controller.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: "postgres",
                host: configService.get<string>("DB_HOST"),
                port: configService.get<number>("DB_PORT"),
                username: configService.get<string>("DB_USER"),
                password: configService.get<string>("DB_PASSWORD"),
                database: configService.get<string>("DB_NAME"),
                autoLoadEntities: true,
                synchronize: configService.get<string>("NODE_ENV") !== "production", // Only for development/learning
            }),
        }),
        UsersModule,
        ProductsModule,
        ReviewsModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
    