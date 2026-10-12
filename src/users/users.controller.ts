import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service.js";
import { CreateUserDto } from "./DTOs/create-user.dto.js";
import { UpdateUserDto } from "./DTOs/update-user.dto.js";
import { RegisterDto } from "./DTOs/register.dto.js";
import { LoginDto } from "./DTOs/login.dto.js";
import { AuthGuard } from "./guards/auth.guard.js";
import { RolesGuard } from "./guards/roles.guard.js";
import { CurrentUser } from "./decorators/current-user.decorator.js";
import { Roles } from "./decorators/user-role.decorator.js";
import { UserType } from "../utils/enums.js";
import type { JwtPayload } from "../utils/types.js";

@Controller("users/auth")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get("me")
    @UseGuards(AuthGuard)
    getMe(@CurrentUser() user: JwtPayload) {
        return this.usersService.getUserById(user.userId);
    }

    @Get()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
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