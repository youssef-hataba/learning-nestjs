import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class VerifyCodeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @Length(6, 6, { message: "Verification code must be exactly 6 digits" })
    code: string;
}
