import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, HttpCode, HttpStatus } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { CreateUserDto } from "./DTOs/create-user.dto.js";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { RegisterDto } from "./DTOs/register.dto.js";
import { LoginDto } from "./DTOs/login.dto.js";

@Controller("users/auth")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Get(":id")
    getUserById(@Param("id", ParseUUIDPipe) id: string) {
        return this.usersService.getUserById(id);
    }

    @Post("register")
    register(@Body() body: RegisterDto) {
        return this.usersService.register(body);
    }

    @Post("login") // 201
    @HttpCode(HttpStatus.OK) // 200
    login(@Body() body: LoginDto) {
        return this.usersService.login(body);
    }

    @Post()
    createUser(@Body() body: CreateUserDto) {
        return this.usersService.createUser(body);
    }

    @Put(":id")
    updateUser(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() body: UpdateUserDto
    ) {
        return this.usersService.updateUser(id, body);
    }

    @Delete(":id")
    deleteUser(@Param("id", ParseUUIDPipe) id: string) {
        return this.usersService.deleteUser(id);
    }
}