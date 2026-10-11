import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcryptjs";
import { CreateUserDto } from "./DTOs/create-user.dto.js";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { RegisterDto } from "./DTOs/register.dto.js";
import { LoginDto } from "./DTOs/login.dto.js";
import { User } from "./user.entity.js";
import { JwtPayload } from "../utils/types.js";
import { UserType } from "../utils/enums.js";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    private generateJWT(payload: JwtPayload): string {
        return this.jwtService.sign(payload);
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
        });

        if (existingUser) {
            if (existingUser.email === email) {
                throw new BadRequestException("A user with this email already exists");
            }
            throw new BadRequestException("Username is already taken");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = this.usersRepository.create({
            username,
            email,
            password: hashedPassword,
            userType: UserType.USER,
        });

        const savedUser = await this.usersRepository.save(newUser);
        const { password: _, ...userWithoutPassword } = savedUser;

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
            .addSelect("user.password")
            .addSelect("user.userType")
            .where("user.email = :email", { email })
            .getOne();

        if (!user) {
            throw new BadRequestException("Invalid email or password");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new BadRequestException("Invalid email or password");
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

    async createUser(body: CreateUserDto): Promise<User> {
        let password = body.password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);
        }
        const newUser = this.usersRepository.create({
            ...body,
            password,
        });
        const savedUser = await this.usersRepository.save(newUser);
        return await this.getUserById(savedUser.id);
    }

    async updateUser(id: string, body: UpdateUserDto): Promise<User> {
        const user = await this.getUserById(id);
        user.username = body.username ?? user.username;
        user.email = body.email ?? user.email;
        if (body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(body.password, salt);
        }
        await this.usersRepository.save(user);
        return await this.getUserById(id);
    }

    async deleteUser(id: string): Promise<{ message: string }> {
        const user = await this.getUserById(id);
        await this.usersRepository.remove(user);
        return {
            message: "User deleted successfully",
        };
    }
}
