var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNotEmpty, IsString, IsNumber, Min, Length } from "class-validator";
export class CreateProductDto {
    title;
    description;
    price;
}
__decorate([
    IsString(),
    IsNotEmpty(),
    Length(3, 30, { message: "Title must be between 3 and 30 characters long" }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "title", void 0);
__decorate([
    IsString(),
    IsNotEmpty(),
    Length(5, 500, { message: "Description must be between 5 and 500 characters long" }),
    __metadata("design:type", String)
], CreateProductDto.prototype, "description", void 0);
__decorate([
    IsNumber({}, { message: "Price must be a number" }),
    IsNotEmpty({ message: "Price is required" }),
    Min(0, { message: "Price must be a positive number" }),
    __metadata("design:type", Number)
], CreateProductDto.prototype, "price", void 0);
//# sourceMappingURL=create-product.dto.js.map