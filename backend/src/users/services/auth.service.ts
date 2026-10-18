import { randomUUID, randomInt } from "node:crypto";
import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { User } from "../user.entity.js";
import { JwtPayload } from "../../utils/types.js";
import { UserType } from "../../utils/enums.js";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { EVENT_USER_REGISTERED, EVENT_SEND_VERIFICATION_CODE } from "../../mail/mail.constants.js";
import { RedisService } from "../../redis/redis.service.js";
import { SendVerificationCodeDto } from "../DTOs/send-verification-code.dto.js";
import { VerifyCodeDto } from "../DTOs/verify-code.dto.js";
import { RegisterDto } from "../DTOs/register.dto.js";
import { LoginDto } from "../DTOs/login.dto.js";

// ==========================================
// ⚙️ CONFIGURATION CONSTANTS
// ==========================================
const OTP_EXPIRATION_SECONDS = 600; // 10 minutes
const VERIFICATION_TOKEN_EXPIRATION_SECONDS = 900; // 15 minutes
const SOFT_DELETE_GRACE_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const BCRYPT_SALT_ROUNDS = 10;

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
        private readonly eventEmitter: EventEmitter2,
        private readonly redisService: RedisService,
    ) {}

    // ==========================================
    // 🔐 TOKEN & CRYPTOGRAPHY UTILITIES
    // ==========================================

    generateJWT(payload: JwtPayload): string {
        return this.jwtService.sign(payload);
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
        return await bcrypt.hash(password, salt);
    }

    verifyToken(token: string): JwtPayload {
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

    // ==========================================
    // 📨 TWO-STEP PRE-REGISTRATION OTP FLOW
    // ==========================================

    async sendVerificationCode(body: SendVerificationCodeDto): Promise<{ message: string }> {
        const { email } = body;

        const existingUser = await this.usersRepository.findOne({
            where: { email },
            withDeleted: true,
        });

        if (existingUser) {
            throw new BadRequestException("A user with this email already exists");
        }

        // Generate cryptographically secure 6-digit random code
        const code = randomInt(100000, 1000000).toString();

        // Store OTP in Redis
        await this.redisService.set(`email_verification_otp:${email}`, code, OTP_EXPIRATION_SECONDS);

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

        // Generate single-use verification token
        const verificationToken = randomUUID();
        await this.redisService.set(
            `verification_token:${verificationToken}`,
            email,
            VERIFICATION_TOKEN_EXPIRATION_SECONDS
        );

        return {
            message: "Email verified successfully. You can now complete your registration.",
            verificationToken,
        };
    }

    // ==========================================
    // 👤 REGISTRATION & LOGIN
    // ==========================================

    async register(body: RegisterDto): Promise<{ message: string; user: Partial<User>; token: string }> {
        const { username, verificationToken, password, confirmPassword } = body;

        if (password !== confirmPassword) {
            throw new BadRequestException("Password and confirmation password do not match");
        }

        // 1. Validate verified email linked to token & verify username availability
        const email = await this.validateVerificationToken(verificationToken);
        await this.assertUsernameAvailable(username);

        // 2. Hash password and persist user
        const hashedPassword = await this.hashPassword(password);
        const newUser = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            userType: UserType.USER,
            isAccountVerified: true,
        });

        const savedUser = await this.usersRepository.save(newUser);

        // 3. Clean up Redis token and emit domain event for welcome email
        await this.redisService.del(`verification_token:${verificationToken}`);
        this.eventEmitter.emit(EVENT_USER_REGISTERED, {
            userId: savedUser.id,
            email: savedUser.email,
            username: savedUser.username,
        });

        // 4. Issue Planto JWT
        const token = this.generateJWT({
            userId: savedUser.id,
            userType: savedUser.userType,
        });

        const { password: _, ...userWithoutPassword } = savedUser;

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

        if (!user.password) {
            throw new BadRequestException(
                "This account was registered using Google. Please click 'Continue with Google' to sign in."
            );
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new BadRequestException("Invalid email or password");
        }

        // Handle account restoration or suspension if user was soft-deleted
        if (user.deletedAt) {
            await this.handleSoftDeletedAccount(user);
        }

        const token = this.generateJWT({
            userId: user.id,
            userType: user.userType,
        });

        const { password: _, ...userWithoutPassword } = user;

        return {
            message: "User logged in successfully",
            user: userWithoutPassword,
            token,
        };
    }

    // ==========================================
    // 🔒 PRIVATE WORKFLOW HELPERS
    // ==========================================

    /**
     * Validates that the verification token exists in Redis and returns the verified email.
     */
    private async validateVerificationToken(verificationToken: string): Promise<string> {
        const email = await this.redisService.get(`verification_token:${verificationToken}`);
        if (!email) {
            throw new BadRequestException(
                "Invalid or expired verification token. Please verify your email again."
            );
        }
        return email;
    }

    /**
     * Verifies that the username is not already taken by an active or deleted user.
     */
    private async assertUsernameAvailable(username: string): Promise<void> {
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
    }

    /**
     * Validates 30-day grace period for soft-deleted accounts upon login.
     * Restores self-deleted accounts or enforces admin suspension.
     */
    private async handleSoftDeletedAccount(user: User): Promise<void> {
        const timeSinceDeletion = Date.now() - new Date(user.deletedAt!).getTime();

        if (timeSinceDeletion > SOFT_DELETE_GRACE_PERIOD_MS) {
            throw new BadRequestException(
                "This account was deleted more than 30 days ago and cannot be recovered."
            );
        }

        if (user.deletedByAdmin) {
            throw new ForbiddenException(
                "Your account has been suspended by an administrator. Please contact an administrator within 30 days to appeal or restore your account."
            );
        }

        // Auto-restore account if user self-deleted and logs in within 30 days
        await this.usersRepository.restore(user.id);
        user.deletedAt = null;
    }
}
