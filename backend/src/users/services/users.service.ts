import {
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user.entity.js";
import { UpdateUserDto } from "../DTOs/update-user.dto.js";
import { AuthService } from "./auth.service.js";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly authService: AuthService,
    ) {}

    // ==========================================
    // 👤 CORE USER QUERIES & RETRIEVAL
    // ==========================================

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

    async getMe(token: string): Promise<User> {
        const payload = this.authService.verifyToken(token);
        return await this.getUserById(payload.userId);
    }

    // ==========================================
    // 🛠️ USER ACCOUNT MUTATIONS
    // ==========================================

    async updateUser(id: string, body: UpdateUserDto): Promise<User> {
        const user = await this.getUserById(id);
        user.username = body.username ?? user.username;
        user.email = body.email ?? user.email;
        if (body.password) {
            user.password = await this.authService.hashPassword(body.password);
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
}
