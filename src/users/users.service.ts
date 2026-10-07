import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./DTOs/create-user.dto.js";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { User } from "./user.entity.js";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) {}

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

    async createUser(body: CreateUserDto): Promise<User> {
        const newUser = this.usersRepository.create(body);
        const savedUser = await this.usersRepository.save(newUser);
        return await this.getUserById(savedUser.id);
    }

    async updateUser(id: string, body: UpdateUserDto): Promise<User> {
        const user = await this.getUserById(id);
        user.username = body.username ?? user.username;
        user.email = body.email ?? user.email;
        user.password = body.password ?? user.password;
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
