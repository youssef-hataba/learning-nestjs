import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional, Min, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: "Name is required" })
    @Length(3, 30, { message: "Name must be between 3 and 30 characters long" })
    name: string;

    @IsEmail({}, { message: "Invalid email address" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsOptional()
    @IsNumber({}, { message: "Age must be a number" })
    @Min(1, { message: "Age must be a positive number" })
    age?: number;
}
