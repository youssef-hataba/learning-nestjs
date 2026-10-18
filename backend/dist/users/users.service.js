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
import { randomUUID } from "node:crypto";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { ConfigService } from "@nestjs/config";
import { User } from "./user.entity.js";
import { UserType } from "../utils/enums.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EVENT_USER_REGISTERED, EVENT_SEND_VERIFICATION_CODE } from "../mail/mail.constants.js";
import { RedisService } from "../redis/redis.service.js";
import * as fs from "fs";
import * as path from "path";
import { PROFILE_IMAGES_DIR } from "./helpers/profile-image-upload.helper.js";
let UsersService = class UsersService {
    usersRepository;
    jwtService;
    eventEmitter;
    redisService;
    configService;
    constructor(usersRepository, jwtService, eventEmitter, redisService, configService) {
        this.usersRepository = usersRepository;
        this.jwtService = jwtService;
        this.eventEmitter = eventEmitter;
        this.redisService = redisService;
        this.configService = configService;
    }
    generateJWT(payload) {
        return this.jwtService.sign(payload);
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }
    verifyToken(token) {
        if (!token) {
            throw new UnauthorizedException("No token provided");
        }
        const cleanToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
        try {
            return this.jwtService.verify(cleanToken);
        }
        catch {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }
    async getMe(token) {
        const payload = this.verifyToken(token);
        return await this.getUserById(payload.userId);
    }
    async getAllUsers() {
        return await this.usersRepository.find({
            relations: { products: true, reviews: true },
        });
    }
    async getUserById(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: { products: true, reviews: true },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }
    async sendVerificationCode(body) {
        const { email } = body;
        const existingUser = await this.usersRepository.findOne({
            where: { email },
            withDeleted: true,
        });
        if (existingUser) {
            throw new BadRequestException("A user with this email already exists");
        }
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.redisService.set(`email_verification_otp:${email}`, code, 600);
        this.eventEmitter.emit(EVENT_SEND_VERIFICATION_CODE, {
            email,
            code,
        });
        return {
            message: "Verification code sent successfully to your email. It expires in 10 minutes.",
        };
    }
    async verifyCode(body) {
        const { email, code } = body;
        const storedOtp = await this.redisService.get(`email_verification_otp:${email}`);
        if (!storedOtp) {
            throw new BadRequestException("Verification code has expired or was not requested");
        }
        if (storedOtp !== code) {
            throw new BadRequestException("Invalid verification code");
        }
        await this.redisService.del(`email_verification_otp:${email}`);
        const verificationToken = randomUUID();
        await this.redisService.set(`verification_token:${verificationToken}`, email, 900);
        return {
            message: "Email verified successfully. You can now complete your registration.",
            verificationToken,
        };
    }
    async register(body) {
        const { username, verificationToken, password, confirmPassword } = body;
        if (password !== confirmPassword) {
            throw new BadRequestException("Password and confirmation password do not match");
        }
        const email = await this.redisService.get(`verification_token:${verificationToken}`);
        if (!email) {
            throw new BadRequestException("Invalid or expired verification token. Please verify your email again.");
        }
        const existingUser = await this.usersRepository.findOne({
            where: { username },
            withDeleted: true,
        });
        if (existingUser) {
            if (existingUser.deletedAt) {
                throw new BadRequestException("An account with this username was deleted. Please log in within 30 days of deletion to restore it.");
            }
            throw new BadRequestException("Username is already taken");
        }
        const hashedPassword = await this.hashPassword(password);
        const newUser = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            userType: UserType.USER,
            isAccountVerified: true,
        });
        const savedUser = await this.usersRepository.save(newUser);
        await this.redisService.del(`verification_token:${verificationToken}`);
        const { password: _, ...userWithoutPassword } = savedUser;
        this.eventEmitter.emit(EVENT_USER_REGISTERED, {
            userId: savedUser.id,
            email: savedUser.email,
            username: savedUser.username,
        });
        const token = this.generateJWT({
            userId: savedUser.id,
            userType: savedUser.userType,
        });
        return {
            message: "User registered successfully",
            user: userWithoutPassword,
            token,
        };
    }
    async login(body) {
        const { email, password } = body;
        const user = await this.usersRepository
            .createQueryBuilder("user")
            .withDeleted()
            .addSelect("user.password")
            .addSelect("user.userType")
            .addSelect("user.deletedByAdmin")
            .where("user.email = :email", { email })
            .getOne();
        if (!user) {
            throw new BadRequestException("Invalid email or password");
        }
        if (!user.password) {
            throw new BadRequestException("This account was registered using Google. Please click 'Continue with Google' to sign in.");
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new BadRequestException("Invalid email or password");
        }
        if (user.deletedAt) {
            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
            const timeSinceDeletion = Date.now() - new Date(user.deletedAt).getTime();
            if (timeSinceDeletion > thirtyDaysInMs) {
                throw new BadRequestException("This account was deleted more than 30 days ago and cannot be recovered.");
            }
            if (user.deletedByAdmin) {
                throw new ForbiddenException("Your account has been suspended by an administrator. Please contact an administrator within 30 days to appeal or restore your account.");
            }
            await this.usersRepository.restore(user.id);
            user.deletedAt = null;
        }
        const { password: _, ...userWithoutPassword } = user;
        const token = this.generateJWT({
            userId: user.id,
            userType: user.userType,
        });
        return {
            message: "User logged in successfully",
            user: userWithoutPassword,
            token,
        };
    }
    async updateUser(id, body) {
        const user = await this.getUserById(id);
        user.username = body.username ?? user.username;
        user.email = body.email ?? user.email;
        if (body.password) {
            user.password = await this.hashPassword(body.password);
        }
        await this.usersRepository.save(user);
        return await this.getUserById(id);
    }
    async deleteUser(id, isBannedByAdmin = false) {
        const user = await this.getUserById(id);
        user.deletedByAdmin = isBannedByAdmin;
        await this.usersRepository.save(user);
        await this.usersRepository.softRemove(user);
        return {
            message: isBannedByAdmin
                ? "User account has been suspended by administrator."
                : "User account deleted successfully. You have 30 days to log back in to reactivate your account.",
        };
    }
    async restoreUser(id) {
        const user = await this.usersRepository.findOne({
            where: { id },
            withDeleted: true,
        });
        if (!user || !user.deletedAt) {
            throw new NotFoundException("Suspended or deleted user not found");
        }
        await this.usersRepository.restore(id);
        user.deletedByAdmin = false;
        await this.usersRepository.save(user);
        return {
            message: "User account restored successfully by administrator.",
        };
    }
    async setProfileImage(userId, filename) {
        const user = await this.getUserById(userId);
        const isUpdated = Boolean(user.profileImage);
        if (user.profileImage) {
            this.deleteImageFileFromDisk(user.profileImage);
        }
        user.profileImage = filename;
        await this.usersRepository.save(user);
        return {
            message: isUpdated ? "Profile image updated successfully" : "Profile image set successfully",
            profileImage: filename,
        };
    }
    async removeProfileImage(userId) {
        const user = await this.getUserById(userId);
        if (!user.profileImage) {
            throw new BadRequestException("User does not have a profile image to remove");
        }
        this.deleteImageFileFromDisk(user.profileImage);
        user.profileImage = null;
        await this.usersRepository.save(user);
        return {
            message: "Profile image removed successfully",
        };
    }
    async getProfileImagePath(userId) {
        const user = await this.getUserById(userId);
        if (!user.profileImage) {
            throw new NotFoundException("User does not have a profile image");
        }
        const filePath = path.join(PROFILE_IMAGES_DIR, user.profileImage);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException("Profile image file not found on disk");
        }
        return filePath;
    }
    deleteImageFileFromDisk(filename) {
        try {
            const filePath = path.join(PROFILE_IMAGES_DIR, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error(`Failed to delete profile image "${filename}" from disk:`, error);
        }
    }
    getGoogleAuthUrl() {
        const clientId = this.configService.get("GOOGLE_CLIENT_ID");
        const redirectUri = this.configService.get("GOOGLE_CALLBACK_URL", "http://localhost:3000/api/users/auth/google/callback");
        if (!clientId) {
            throw new BadRequestException("GOOGLE_CLIENT_ID is not configured.");
        }
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: "code",
            scope: "openid profile email",
            access_type: "offline",
            prompt: "consent",
        });
        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }
    getFrontendUrl() {
        return this.configService.get("FRONTEND_URL", "http://localhost:3001");
    }
    async handleGoogleCallback(code) {
        const clientId = this.configService.get("GOOGLE_CLIENT_ID");
        const clientSecret = this.configService.get("GOOGLE_CLIENT_SECRET");
        const redirectUri = this.configService.get("GOOGLE_CALLBACK_URL", "http://localhost:3000/api/users/auth/google/callback");
        const frontendUrl = this.getFrontendUrl();
        if (!clientId || !clientSecret) {
            throw new BadRequestException("Google OAuth credentials are not configured.");
        }
        const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                code,
                client_id: clientId,
                client_secret: clientSecret,
                redirect_uri: redirectUri,
                grant_type: "authorization_code",
            }),
        });
        if (!tokenResponse.ok) {
            const errorDetails = await tokenResponse.text();
            throw new BadRequestException(`Google code exchange failed: ${errorDetails}`);
        }
        const tokenData = (await tokenResponse.json());
        const accessToken = tokenData.access_token;
        const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!userInfoResponse.ok) {
            throw new BadRequestException("Failed to fetch Google user profile");
        }
        const googleUser = (await userInfoResponse.json());
        if (!googleUser.email) {
            throw new BadRequestException("No email associated with this Google account");
        }
        let user = await this.usersRepository.findOne({
            where: [{ googleId: googleUser.sub }, { email: googleUser.email }],
            withDeleted: true,
        });
        if (user) {
            if (user.deletedAt) {
                await this.usersRepository.restore(user.id);
                user.deletedAt = null;
            }
            let updated = false;
            if (!user.googleId) {
                user.googleId = googleUser.sub;
                updated = true;
            }
            if (!user.isAccountVerified) {
                user.isAccountVerified = true;
                updated = true;
            }
            if (!user.profileImage && googleUser.picture) {
                user.profileImage = googleUser.picture;
                updated = true;
            }
            if (updated) {
                user = await this.usersRepository.save(user);
            }
        }
        else {
            const rawName = (googleUser.name || googleUser.email.split("@")[0])
                .toLowerCase()
                .replace(/[^a-z0-9_]/g, "_")
                .slice(0, 15);
            const baseUsername = rawName.length >= 3 ? rawName : `user_${Math.floor(100 + Math.random() * 900)}`;
            let username = baseUsername;
            let counter = 1;
            while (await this.usersRepository.findOne({ where: { username }, withDeleted: true })) {
                username = `${baseUsername.slice(0, 10)}_${Math.floor(1000 + Math.random() * 9000)}`;
                counter++;
                if (counter > 15)
                    break;
            }
            const newUser = this.usersRepository.create({
                username,
                email: googleUser.email,
                googleId: googleUser.sub,
                profileImage: googleUser.picture || null,
                isAccountVerified: true,
                userType: UserType.USER,
                password: null,
            });
            user = await this.usersRepository.save(newUser);
            this.eventEmitter.emit(EVENT_USER_REGISTERED, {
                userId: user.id,
                email: user.email,
                username: user.username,
            });
        }
        const token = this.generateJWT({
            userId: user.id,
            userType: user.userType,
        });
        return `${frontendUrl}/auth/callback?token=${encodeURIComponent(token)}`;
    }
};
UsersService = __decorate([
    Injectable(),
    __param(0, InjectRepository(User)),
    __metadata("design:paramtypes", [Repository,
        JwtService,
        EventEmitter2,
        RedisService,
        ConfigService])
], UsersService);
export { UsersService };
//# sourceMappingURL=users.service.js.map