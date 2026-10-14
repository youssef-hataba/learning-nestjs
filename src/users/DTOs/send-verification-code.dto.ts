import { IsEmail, IsNotEmpty } from "class-validator";

export class SendVerificationCodeDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
}
