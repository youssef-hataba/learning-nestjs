var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Get, Param, Post, Put, Delete, Patch, ParseUUIDPipe, HttpCode, HttpStatus, UseGuards, UseInterceptors, UploadedFile, Res, BadRequestException } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { UsersService } from "./users.service.js";
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
import { profileImageUploadOptions } from "./helpers/profile-image-upload.helper.js";
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    getMe(user) {
        return this.usersService.getUserById(user.userId);
    }
    updateMe(user, body) {
        return this.usersService.updateUser(user.userId, body);
    }
    deleteMe(user) {
        return this.usersService.deleteUser(user.userId, false);
    }
    uploadProfileImage(user, file) {
        if (!file) {
            throw new BadRequestException("Profile image file is required");
        }
        return this.usersService.setProfileImage(user.userId, file.filename);
    }
    async getProfileImage(user, res) {
        const filePath = await this.usersService.getProfileImagePath(user.userId);
        res.sendFile(filePath);
    }
    removeProfileImage(user) {
        return this.usersService.removeProfileImage(user.userId);
    }
    sendVerificationCode(body) {
        return this.usersService.sendVerificationCode(body);
    }
    verifyCode(body) {
        return this.usersService.verifyCode(body);
    }
    register(body) {
        return this.usersService.register(body);
    }
    login(body) {
        return this.usersService.login(body);
    }
    getAllUsers() {
        return this.usersService.getAllUsers();
    }
    getUserById(id) {
        return this.usersService.getUserById(id);
    }
    updateUserByAdmin(id, body) {
        return this.usersService.updateUser(id, body);
    }
    deleteUserByAdmin(id) {
        return this.usersService.deleteUser(id, true);
    }
    restoreUser(id) {
        return this.usersService.restoreUser(id);
    }
};
__decorate([
    Get("me"),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getMe", null);
__decorate([
    Put("me"),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateMe", null);
__decorate([
    Delete("me"),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteMe", null);
__decorate([
    Post("profile-image"),
    UseGuards(AuthGuard),
    UseInterceptors(FileInterceptor("image", profileImageUploadOptions)),
    __param(0, CurrentUser()),
    __param(1, UploadedFile()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "uploadProfileImage", null);
__decorate([
    Get("profile-image"),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfileImage", null);
__decorate([
    Delete("profile-image"),
    UseGuards(AuthGuard),
    __param(0, CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "removeProfileImage", null);
__decorate([
    Post("send-verification-code"),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SendVerificationCodeDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "sendVerificationCode", null);
__decorate([
    Post("verify-code"),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [VerifyCodeDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "verifyCode", null);
__decorate([
    Post("register"),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "register", null);
__decorate([
    Post("login"),
    HttpCode(HttpStatus.OK),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "login", null);
__decorate([
    Get(),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getAllUsers", null);
__decorate([
    Get(":id"),
    __param(0, Param("id", ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUserById", null);
__decorate([
    Put(":id"),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "updateUserByAdmin", null);
__decorate([
    Delete(":id"),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "deleteUserByAdmin", null);
__decorate([
    Patch(":id/restore"),
    Roles(UserType.ADMIN),
    UseGuards(AuthGuard, RolesGuard),
    __param(0, Param("id", ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "restoreUser", null);
UsersController = __decorate([
    Controller("users/auth"),
    __metadata("design:paramtypes", [UsersService])
], UsersController);
export { UsersController };
//# sourceMappingURL=users.controller.js.map