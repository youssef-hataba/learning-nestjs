import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./DTOs/create-user.dto.js";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";

export type User = {
    id: number;
    name: string;
    email: string;
    age?: number;
};

@Injectable()
export class UsersService {
    private users: User[] = [
        {
            id: 1,
            name: "Alice",
            email: "alice@example.com",
            age: 25,
        },
        {
            id: 2,
            name: "Bob",
            email: "bob@example.com",
            age: 30,
        },
    ];

    getAllUsers(): User[] {
        return this.users;
    }

    getUserById(id: number): User {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return user;
    }

    createUser(body: CreateUserDto): User {
        const newUser: User = {
            id: this.users.length + 1,
            name: body.name,
            email: body.email,
            age: body.age,
        };
        this.users.push(newUser);
        return newUser;
    }

    updateUser(id: number, body: UpdateUserDto): User {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        user.name = body.name ?? user.name;
        user.email = body.email ?? user.email;
        user.age = body.age ?? user.age;
        return user;
    }

    deleteUser(id: number) {
        const user = this.users.find(u => u.id === id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        this.users = this.users.filter(u => u.id !== id);
        return {
            message: "User deleted successfully",
        };
    }
}
