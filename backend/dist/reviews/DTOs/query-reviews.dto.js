var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsString, IsNumber, Min, Max, IsEnum, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { SortOrder } from "../../utils/enums.js";
import { PaginationDto } from "../../utils/pagination.dto.js";
export var ReviewSortBy;
(function (ReviewSortBy) {
    ReviewSortBy["CREATED_AT"] = "createdAt";
    ReviewSortBy["RATING"] = "rating";
})(ReviewSortBy || (ReviewSortBy = {}));
export class QueryReviewsDto extends PaginationDto {
    search;
    rating;
    minRating;
    maxRating;
    productId;
    userId;
    sortBy = ReviewSortBy.CREATED_AT;
    sortOrder = SortOrder.DESC;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryReviewsDto.prototype, "search", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({}, { message: "rating must be a valid number" }),
    Min(1, { message: "rating must be at least 1" }),
    Max(5, { message: "rating cannot exceed 5" }),
    __metadata("design:type", Number)
], QueryReviewsDto.prototype, "rating", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({}, { message: "minRating must be a valid number" }),
    Min(1, { message: "minRating must be at least 1" }),
    Max(5, { message: "minRating cannot exceed 5" }),
    __metadata("design:type", Number)
], QueryReviewsDto.prototype, "minRating", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({}, { message: "maxRating must be a valid number" }),
    Min(1, { message: "maxRating must be at least 1" }),
    Max(5, { message: "maxRating cannot exceed 5" }),
    __metadata("design:type", Number)
], QueryReviewsDto.prototype, "maxRating", void 0);
__decorate([
    IsOptional(),
    IsUUID("all", { message: "productId must be a valid UUID" }),
    __metadata("design:type", String)
], QueryReviewsDto.prototype, "productId", void 0);
__decorate([
    IsOptional(),
    IsUUID("all", { message: "userId must be a valid UUID" }),
    __metadata("design:type", String)
], QueryReviewsDto.prototype, "userId", void 0);
__decorate([
    IsOptional(),
    IsEnum(ReviewSortBy, { message: "sortBy must be one of: createdAt, rating" }),
    __metadata("design:type", String)
], QueryReviewsDto.prototype, "sortBy", void 0);
__decorate([
    IsOptional(),
    IsEnum(SortOrder, { message: "sortOrder must be ASC or DESC" }),
    __metadata("design:type", String)
], QueryReviewsDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=query-reviews.dto.js.map