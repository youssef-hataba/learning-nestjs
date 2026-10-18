import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersController } from "./users.controller.js";
import { UsersService } from "./services/users.service.js";
import { AuthService } from "./services/auth.service.js";
import { GoogleAuthService } from "./services/google-auth.service.js";
import { ProfileImageService } from "./services/profile-image.service.js";
import { UsersCleanupService } from "./services/users-cleanup.service.js";
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
    providers: [
        UsersService,
        AuthService,
        GoogleAuthService,
        ProfileImageService,
        UsersCleanupService,
        AuthGuard,
        RolesGuard,
    ],
    exports: [
        UsersService,
        AuthService,
        GoogleAuthService,
        ProfileImageService,
        AuthGuard,
        RolesGuard,
    ],
})
export class UsersModule { }