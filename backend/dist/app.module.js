var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
import { RedisModule } from "./redis/redis.module.js";
import { AppController } from "./app.controller.js";
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
        imports: [
            ConfigModule.forRoot({
                isGlobal: true,
            }),
            ScheduleModule.forRoot(),
            EventEmitterModule.forRoot(),
            BullModule.forRootAsync({
                inject: [ConfigService],
                useFactory: (configService) => ({
                    connection: {
                        host: configService.get("REDIS_HOST", "localhost"),
                        port: Number(configService.get("REDIS_PORT", 6379)),
                    },
                }),
            }),
            TypeOrmModule.forRootAsync({
                inject: [ConfigService],
                useFactory: (configService) => ({
                    type: "postgres",
                    host: configService.get("DB_HOST"),
                    port: configService.get("DB_PORT"),
                    username: configService.get("DB_USER"),
                    password: configService.get("DB_PASSWORD"),
                    database: configService.get("DB_NAME"),
                    autoLoadEntities: true,
                    synchronize: configService.get("NODE_ENV") !== "production",
                }),
            }),
            UsersModule,
            ProductsModule,
            ReviewsModule,
            MailModule,
            RedisModule,
        ],
        controllers: [AppController],
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map