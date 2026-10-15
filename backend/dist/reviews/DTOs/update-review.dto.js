var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsString, IsNumber, Min, Max, Length } from "class-validator";
export class UpdateReviewDto {
    rating;
    comment;
}
__decorate([
    IsOptional(),
    IsNumber({}, { message: "Rating must be a number" }),
    Min(1, { message: "Rating must be at least 1" }),
    Max(5, { message: "Rating cannot exceed 5" }),
    __metadata("design:type", Number)
], UpdateReviewDto.prototype, "rating", void 0);
__decorate([
    IsOptional(),
    IsString(),
    Length(3, 300, { message: "Comment must be between 3 and 300 characters long" }),
    __metadata("design:type", String)
], UpdateReviewDto.prototype, "comment", void 0);
//# sourceMappingURL=update-review.dto.js.map