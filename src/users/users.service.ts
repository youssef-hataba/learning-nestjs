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
import { EVENT_USER_REGISTERED } from "../mail/mail.constants.js";
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

    async register(body: RegisterDto): Promise<{ message: string; user: Partial<User>; token: string }> {
        const { username, email, password, confirmPassword } = body;

        if (password !== confirmPassword) {
            throw new BadRequestException("Password and confirmation password do not match");
        }

        const existingUser = await this.usersRepository.findOne({
            where: [{ email }, { username }],
            withDeleted: true,
        });

        if (existingUser) {
            if (existingUser.deletedAt) {
                throw new BadRequestException(
                    "An account with this email/username was deleted. Please log in within 30 days of deletion to restore it."
                );
            }
            if (existingUser.email === email) {
                throw new BadRequestException("A user with this email already exists");
            }
            throw new BadRequestException("Username is already taken");
        }

        const hashedPassword = await this.hashPassword(password);

        const newUser = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            userType: UserType.USER,
        });

        const savedUser = await this.usersRepository.save(newUser);
        const { password: _, ...userWithoutPassword } = savedUser;

        //* Emit domain event for user registration (triggers decoupled queue processing)
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

