import type { Response } from "express";
import { UsersService } from "./users.service.js";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { RegisterDto } from "./DTOs/register.dto.js";
import { LoginDto } from "./DTOs/login.dto.js";
import { SendVerificationCodeDto } from "./DTOs/send-verification-code.dto.js";
import { VerifyCodeDto } from "./DTOs/verify-code.dto.js";
import type { JwtPayload } from "../utils/types.js";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: JwtPayload): Promise<import("./user.entity.js").User>;
    updateMe(user: JwtPayload, body: UpdateUserDto): Promise<import("./user.entity.js").User>;
    deleteMe(user: JwtPayload): Promise<{
        message: string;
    }>;
    uploadProfileImage(user: JwtPayload, file?: Express.Multer.File): Promise<{
        message: string;
        profileImage: string;
    }>;
    getProfileImage(user: JwtPayload, res: Response): Promise<void>;
    removeProfileImage(user: JwtPayload): Promise<{
        message: string;
    }>;
    sendVerificationCode(body: SendVerificationCodeDto): Promise<{
        message: string;
    }>;
    verifyCode(body: VerifyCodeDto): Promise<{
        message: string;
        verificationToken: string;
    }>;
    register(body: RegisterDto): Promise<{
        message: string;
        user: Partial<import("./user.entity.js").User>;
        token: string;
    }>;
    login(body: LoginDto): Promise<{
        message: string;
        user: Partial<import("./user.entity.js").User>;
        token: string;
    }>;
    googleAuth(res: Response): void;
    googleAuthCallback(code: string, error: string, res: Response): Promise<void>;
    getAllUsers(): Promise<import("./user.entity.js").User[]>;
    getUserById(id: string): Promise<import("./user.entity.js").User>;
    updateUserByAdmin(id: string, body: UpdateUserDto): Promise<import("./user.entity.js").User>;
    deleteUserByAdmin(id: string): Promise<{
        message: string;
    }>;
    restoreUser(id: string): Promise<{
        message: string;
    }>;
}
