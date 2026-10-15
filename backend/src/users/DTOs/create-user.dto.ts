import { IsNotEmpty, IsString, IsEmail, Length, IsOptional } from "class-validator";

export class CreateUserDto {
    @IsOptional()
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
}
