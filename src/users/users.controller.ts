import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { UsersService } from "./users.service.js";
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

    @Put(":id")
    @UseGuards(AuthGuard)
    updateUser(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() body: UpdateUserDto,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        return this.usersService.updateUser(id, body, currentUser);
    }

    @Delete(":id")
    @UseGuards(AuthGuard)
    deleteUser(
        @Param("id", ParseUUIDPipe) id: string,
        @CurrentUser() currentUser: JwtPayload,
    ) {
        return this.usersService.deleteUser(id, currentUser);
    }
}