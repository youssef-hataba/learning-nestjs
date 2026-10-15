var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsString, Length } from "class-validator";
import { Match } from "../../utils/match.decorator.js";
export class RegisterDto {
    verificationToken;
    username;
    password;
    confirmPassword;
}
__decorate([
    IsString(),
    IsNotEmpty({ message: "Verification token is required" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "verificationToken", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: "Username is required" }),
    Length(3, 30, { message: "Username must be between 3 and 30 characters long" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "username", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: "Password is required" }),
    Length(6, 50, { message: "Password must be at least 6 characters long" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "password", void 0);
__decorate([
    IsString(),
    IsNotEmpty({ message: "Password confirmation is required" }),
    Match("password", { message: "Password and confirmation password do not match" }),
    __metadata("design:type", String)
], RegisterDto.prototype, "confirmPassword", void 0);
//# sourceMappingURL=register.dto.js.map