import { Body, Controller, Get, Param, Post, Put, Delete, Patch, ParseUUIDPipe, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile, Res, Query, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
import { UsersService } from "./services/users.service.js";
import { AuthService } from "./services/auth.service.js";
import { GoogleAuthService } from "./services/google-auth.service.js";
import { ProfileImageService } from "./services/profile-image.service.js";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { RegisterDto } from "./DTOs/register.dto.js";
import { LoginDto } from "./DTOs/login.dto.js";
import { SendVerificationCodeDto } from "./DTOs/send-verification-code.dto.js";
import { VerifyCodeDto } from "./DTOs/verify-code.dto.js";
import { AuthGuard } from "./guards/auth.guard.js";
import { RolesGuard } from "./guards/roles.guard.js";
import { CurrentUser } from "./decorators/current-user.decorator.js";
import { Roles } from "./decorators/user-role.decorator.js";
import { UserType } from "../utils/enums.js";
import type { JwtPayload } from "../utils/types.js";
import { profileImageUploadOptions } from "./helpers/profile-image-upload.helper.js";

@Controller("users/auth")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly authService: AuthService,
        private readonly googleAuthService: GoogleAuthService,
        private readonly profileImageService: ProfileImageService,
    ) {}

    // ==========================================
    // 👤 CURRENT USER PROFILE (Self-Service)
    // ==========================================
    @Get("me")
    @UseGuards(AuthGuard)
    getMe(@CurrentUser() user: JwtPayload) {
        return this.usersService.getUserById(user.userId);
    }

    @Put("me")
    @UseGuards(AuthGuard)
    updateMe(
        @CurrentUser() user: JwtPayload,
        @Body() body: UpdateUserDto,
    ) {
        return this.usersService.updateUser(user.userId, body);
    }

    @Delete("me")
    @UseGuards(AuthGuard)
    deleteMe(@CurrentUser() user: JwtPayload) {
        return this.usersService.deleteUser(user.userId, false);
    }

    // ==========================================
    // 🖼️ PROFILE IMAGE (Self-Service)
    // ==========================================
    @Post("profile-image")
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("image", profileImageUploadOptions))
    uploadProfileImage(
        @CurrentUser() user: JwtPayload,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        if (!file) {
            throw new BadRequestException("Profile image file is required");
        }
        return this.profileImageService.setProfileImage(user.userId, file.filename);
    }

    @Get("profile-image")
    @UseGuards(AuthGuard)
    async getProfileImage(
        @CurrentUser() user: JwtPayload,
        @Res() res: Response,
    ) {
        const filePath = await this.profileImageService.getProfileImagePath(user.userId);
        res.sendFile(filePath);
    }

    @Delete("profile-image")
    @UseGuards(AuthGuard)
    removeProfileImage(@CurrentUser() user: JwtPayload) {
        return this.profileImageService.removeProfileImage(user.userId);
    }

    // ==========================================
    // 🔑 AUTHENTICATION
    // ==========================================
    @Post("send-verification-code")
    @HttpCode(HttpStatus.OK)
    sendVerificationCode(@Body() body: SendVerificationCodeDto) {
        return this.authService.sendVerificationCode(body);
    }

    @Post("verify-code")
    @HttpCode(HttpStatus.OK)
    verifyCode(@Body() body: VerifyCodeDto) {
        return this.authService.verifyCode(body);
    }

    @Post("register")
    register(@Body() body: RegisterDto) {
        return this.authService.register(body);
    }

    @Post("login") // 201
    @HttpCode(HttpStatus.OK) // 200
    login(@Body() body: LoginDto) {
        return this.authService.login(body);
    }

    // ==========================================
    // 🌐 GOOGLE OAUTH 2.0
    // ==========================================
    @Get("google")
    googleAuth(@Res() res: Response) {
        const url = this.googleAuthService.getGoogleAuthUrl();
        return res.redirect(url);
    }

    @Get("google/callback")
    async googleAuthCallback(
        @Query("code") code: string,
        @Query("error") error: string,
        @Res() res: Response,
    ) {
        const redirectUrl = await this.googleAuthService.handleGoogleCallback(code, error);
        return res.redirect(redirectUrl);
    }

    // ==========================================
    // 🛠️ ADMIN & GENERAL USER MANAGEMENT
    // ==========================================
    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get(":id")
    getUserById(@Param("id", ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }

    @Put(":id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    updateUserByAdmin(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() body: UpdateUserDto,
    ) {
        return this.usersService.updateUser(id, body);
    }

    @Delete(":id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteUserByAdmin(@Param("id", ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id, true);
    }

    @Patch(":id/restore")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    restoreUser(@Param("id", ParseUUIDPipe) id: string) {
        return this.usersService.restoreUser(id);
    }
}