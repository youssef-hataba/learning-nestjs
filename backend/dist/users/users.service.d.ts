import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { RegisterDto } from "./DTOs/register.dto.js";
import { LoginDto } from "./DTOs/login.dto.js";
import { User } from "./user.entity.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { RedisService } from "../redis/redis.service.js";
import { SendVerificationCodeDto } from "./DTOs/send-verification-code.dto.js";
import { VerifyCodeDto } from "./DTOs/verify-code.dto.js";
export declare class UsersService {
    private readonly usersRepository;
    private readonly jwtService;
    private readonly eventEmitter;
    private readonly redisService;
    private readonly configService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService, eventEmitter: EventEmitter2, redisService: RedisService, configService: ConfigService);
    private generateJWT;
    private hashPassword;
    private verifyToken;
    getMe(token: string): Promise<User>;
    getAllUsers(): Promise<User[]>;
    getUserById(id: string): Promise<User>;
    sendVerificationCode(body: SendVerificationCodeDto): Promise<{
        message: string;
    }>;
    verifyCode(body: VerifyCodeDto): Promise<{
        message: string;
        verificationToken: string;
    }>;
    register(body: RegisterDto): Promise<{
        message: string;
        user: Partial<User>;
        token: string;
    }>;
    login(body: LoginDto): Promise<{
        message: string;
        user: Partial<User>;
        token: string;
    }>;
    updateUser(id: string, body: UpdateUserDto): Promise<User>;
    deleteUser(id: string, isBannedByAdmin?: boolean): Promise<{
        message: string;
    }>;
    restoreUser(id: string): Promise<{
        message: string;
    }>;
    setProfileImage(userId: string, filename: string): Promise<{
        message: string;
        profileImage: string;
    }>;
    removeProfileImage(userId: string): Promise<{
        message: string;
    }>;
    getProfileImagePath(userId: string): Promise<string>;
    private deleteImageFileFromDisk;
    getGoogleAuthUrl(): string;
    getFrontendUrl(): string;
    handleGoogleCallback(code: string): Promise<string>;
}
