import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ScheduleModule } from "@nestjs/schedule";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { BullModule } from "@nestjs/bullmq";
import { UsersModule } from "./users/users.module.js";
import { ProductsModule } from "./products/products.module.js";
import { ReviewsModule } from "./reviews/reviews.module.js";
import { MailModule } from "./mail/mail.module.js";
import { AppController } from "./app.controller.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        BullModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                connection: {
                    host: configService.get<string>("REDIS_HOST", "localhost"),
                    port: Number(configService.get<number>("REDIS_PORT", 6379)),
                },
            }),
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
        MailModule,
    ],
    controllers: [AppController],
})
export class AppModule { }
    