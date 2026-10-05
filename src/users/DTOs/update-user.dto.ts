import { IsOptional, IsString, IsEmail, IsNumber, Min, Length } from "class-validator";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    @Length(3, 30, { message: "Name must be between 3 and 30 characters long" })
    name?: string;

    @IsOptional()
    @IsEmail({}, { message: "Invalid email address" })
    email?: string;

    @IsOptional()
    @IsNumber({}, { message: "Age must be a number" })
    @Min(1, { message: "Age must be a positive number" })
    age?: number;
}
