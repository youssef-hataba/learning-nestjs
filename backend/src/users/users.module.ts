import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./users.service.js";
import { UsersCleanupService } from "./users-cleanup.service.js";
import { User } from "./user.entity.js";
import { AuthGuard } from "./guards/auth.guard.js";
import { RolesGuard } from "./guards/roles.guard.js";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            global: true,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>("JWT_SECRET"),
                signOptions: {
                    expiresIn: (configService.get<string>("JWT_EXPIRES_IN") ?? "15d") as any,
                },
            }),
        }),
    ],
    controllers: [UsersController],
    providers: [UsersService, UsersCleanupService, AuthGuard, RolesGuard],
    exports: [UsersService, AuthGuard, RolesGuard],
})
export class UsersModule { }