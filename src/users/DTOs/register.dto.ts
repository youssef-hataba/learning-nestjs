import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";
import { Match } from "../../utils/match.decorator.js";

export class RegisterDto {
    @IsString()
    @IsNotEmpty({ message: "Username is required" })
    @Length(3, 30, { message: "Username must be between 3 and 30 characters long" })
    username: string;

    @IsEmail({}, { message: "Invalid email address" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsString()
    @IsNotEmpty({ message: "Password is required" })
    @Length(6, 50, { message: "Password must be at least 6 characters long" })
    password: string;

    @IsString()
    @IsNotEmpty({ message: "Password confirmation is required" })
    @Match("password", { message: "Password and confirmation password do not match" })
    confirmPassword: string;
}
