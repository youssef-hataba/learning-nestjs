import { IsOptional, IsString, IsEmail, IsEnum, Length } from "class-validator";
import { UserType } from "../../utils/enums.js";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(3, 30, { message: "Username must be between 3 and 30 characters long" })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: "Invalid email address" })
    email?: string;

    @IsOptional()
    @IsString()
    @Length(6, 50, { message: "Password must be at least 6 characters long" })
    password?: string;

    @IsOptional()
    @IsEnum(UserType, { message: "userType must be either admin or user" })
    userType?: UserType;
}
