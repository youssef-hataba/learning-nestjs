import { randomUUID } from "node:crypto";
import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { RegisterDto } from "./DTOs/register.dto.js";
import { LoginDto } from "./DTOs/login.dto.js";
import { User } from "./user.entity.js";
import { JwtPayload } from "../utils/types.js";
import { UserType } from "../utils/enums.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EVENT_USER_REGISTERED, EVENT_SEND_VERIFICATION_CODE } from "../mail/mail.constants.js";
import { RedisService } from "../redis/redis.service.js";
import { SendVerificationCodeDto } from "./DTOs/send-verification-code.dto.js";
import { VerifyCodeDto } from "./DTOs/verify-code.dto.js";
import * as fs from "fs";
import * as path from "path";
import { PROFILE_IMAGES_DIR } from "./helpers/profile-image-upload.helper.js";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
        private readonly redisService: RedisService,
    ) {}

    private generateJWT(payload: JwtPayload): string {
        return this.jwtService.sign(payload);
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    private verifyToken(token: string): JwtPayload {
        if (!token) {
            throw new UnauthorizedException("No token provided");
        }
        const cleanToken = token.startsWith("Bearer ") ? token.slice(7).trim() : token.trim();
        try {
            return this.jwtService.verify<JwtPayload>(cleanToken);
        } catch {
            throw new UnauthorizedException("Invalid or expired token");
        }
    }

    async getMe(token: string): Promise<User> {
        const payload = this.verifyToken(token);
        return await this.getUserById(payload.userId);
    }

    async getAllUsers(): Promise<User[]> {
        return await this.usersRepository.find({
            relations: { products: true, reviews: true },
        });
    }

    async getUserById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({
            where: { id },
            relations: { products: true, reviews: true },
        });
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    async sendVerificationCode(body: SendVerificationCodeDto): Promise<{ message: string }> {
        const { email } = body;

        const existingUser = await this.usersRepository.findOne({
            where: { email },
            withDeleted: true,
        });

        if (existingUser) {
            throw new BadRequestException("A user with this email already exists");
        }

        // Generate 6-digit random code
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        // Store OTP in Redis for 10 minutes (600s)
        await this.redisService.set(`email_verification_otp:${email}`, code, 600);

        // Emit domain event to enqueue email dispatch in background
        this.eventEmitter.emit(EVENT_SEND_VERIFICATION_CODE, {
            email,
            code,
        });

        return {
            message: "Verification code sent successfully to your email. It expires in 10 minutes.",
        };
    }

    async verifyCode(body: VerifyCodeDto): Promise<{ message: string; verificationToken: string }> {
        const { email, code } = body;

        const storedOtp = await this.redisService.get(`email_verification_otp:${email}`);
        if (!storedOtp) {
            throw new BadRequestException("Verification code has expired or was not requested");
        }

        if (storedOtp !== code) {
            throw new BadRequestException("Invalid verification code");
        }

        // Delete the consumed OTP
        await this.redisService.del(`email_verification_otp:${email}`);

        // Generate single-use verification token valid for 15 minutes (900s)
        const verificationToken = randomUUID();
        await this.redisService.set(`verification_token:${verificationToken}`, email, 900);

        return {
            message: "Email verified successfully. You can now complete your registration.",
            verificationToken,
        };
    }

    async register(body: RegisterDto): Promise<{ message: string; user: Partial<User>; token: string }> {
        const { username, verificationToken, password, confirmPassword } = body;

        if (password !== confirmPassword) {
            throw new BadRequestException("Password and confirmation password do not match");
        }

        // Retrieve and validate the verified email linked to the verification token
        const email = await this.redisService.get(`verification_token:${verificationToken}`);
        if (!email) {
            throw new BadRequestException(
                "Invalid or expired verification token. Please verify your email again."
            );
        }

        // Check username uniqueness (email is guaranteed unique & verified from step 1)
        const existingUser = await this.usersRepository.findOne({
            where: { username },
            withDeleted: true,
        });

        if (existingUser) {
            if (existingUser.deletedAt) {
                throw new BadRequestException(
                    "An account with this username was deleted. Please log in within 30 days of deletion to restore it."
                );
            }
            throw new BadRequestException("Username is already taken");
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            userType: UserType.USER,
            isAccountVerified: true, // Automatically verified through pre-registration OTP!
        });

        const savedUser = await this.usersRepository.save(newUser);

        // Consume and clean up the single-use verification token from Redis
        await this.redisService.del(`verification_token:${verificationToken}`);

        const { password: _, ...userWithoutPassword } = savedUser;

        //* Emit domain event for user registration (triggers decoupled queue processing for welcome email)
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

    async login(body: LoginDto): Promise<{ message: string; user: Partial<User>; token: string }> {
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

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new BadRequestException("Invalid email or password");
        }

        // Soft-delete 30-day grace period logic
        if (user.deletedAt) {
            const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
            const timeSinceDeletion = Date.now() - new Date(user.deletedAt).getTime();

            if (timeSinceDeletion > thirtyDaysInMs) {
                throw new BadRequestException("This account was deleted more than 30 days ago and cannot be recovered.");
            }

            // If account was deleted/suspended by an Admin, user cannot auto-reactivate by logging in
            if (user.deletedByAdmin) {
                throw new ForbiddenException(
                    "Your account has been suspended by an administrator. Please contact an administrator within 30 days to appeal or restore your account."
                );
            }

            // Auto-restore account if user self-deleted and logs in within 30 days
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

    async updateUser(id: string, body: UpdateUserDto): Promise<User> {
        const user = await this.getUserById(id);
        user.username = body.username ?? user.username;
        user.email = body.email ?? user.email;
        if (body.password) {
            user.password = await this.hashPassword(body.password);
        }
        await this.usersRepository.save(user);
        return await this.getUserById(id);
    }

    async deleteUser(id: string, isBannedByAdmin: boolean = false): Promise<{ message: string }> {
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

    async restoreUser(id: string): Promise<{ message: string }> {
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

    // ==========================================
    // 🖼️ PROFILE IMAGE MANAGEMENT
    // ==========================================

    async setProfileImage(userId: string, filename: string): Promise<{ message: string; profileImage: string }> {
        const user = await this.getUserById(userId);
        const isUpdated = Boolean(user.profileImage);

        // If user already has an image on disk, remove it before setting the new one
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

    async removeProfileImage(userId: string): Promise<{ message: string }> {
        const user = await this.getUserById(userId);

        if (!user.profileImage) {
            throw new BadRequestException("User does not have a profile image to remove");
        }

        // Delete image file from disk
        this.deleteImageFileFromDisk(user.profileImage);

        user.profileImage = null;
        await this.usersRepository.save(user);

        return {
            message: "Profile image removed successfully",
        };
    }

    async getProfileImagePath(userId: string): Promise<string> {
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

    private deleteImageFileFromDisk(filename: string): void {
        try {
            const filePath = path.join(PROFILE_IMAGES_DIR, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(`Failed to delete profile image "${filename}" from disk:`, error);
        }
    }
}

