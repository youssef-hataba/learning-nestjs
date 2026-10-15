var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsOptional, IsString, IsNumber, Min, IsEnum, IsUUID } from "class-validator";
import { Type } from "class-transformer";
import { SortOrder } from "../../utils/enums.js";
import { PaginationDto } from "../../utils/pagination.dto.js";
export var ProductSortBy;
(function (ProductSortBy) {
    ProductSortBy["CREATED_AT"] = "createdAt";
    ProductSortBy["PRICE"] = "price";
    ProductSortBy["TITLE"] = "title";
})(ProductSortBy || (ProductSortBy = {}));
export class QueryProductsDto extends PaginationDto {
    search;
    minPrice;
    maxPrice;
    userId;
    sortBy = ProductSortBy.CREATED_AT;
    sortOrder = SortOrder.DESC;
}
__decorate([
    IsOptional(),
    IsString(),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "search", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({}, { message: "minPrice must be a valid number" }),
    Min(0, { message: "minPrice must be greater than or equal to 0" }),
    __metadata("design:type", Number)
], QueryProductsDto.prototype, "minPrice", void 0);
__decorate([
    IsOptional(),
    Type(() => Number),
    IsNumber({}, { message: "maxPrice must be a valid number" }),
    Min(0, { message: "maxPrice must be greater than or equal to 0" }),
    __metadata("design:type", Number)
], QueryProductsDto.prototype, "maxPrice", void 0);
__decorate([
    IsOptional(),
    IsUUID("all", { message: "userId must be a valid UUID" }),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "userId", void 0);
__decorate([
    IsOptional(),
    IsEnum(ProductSortBy, { message: "sortBy must be one of: createdAt, price, title" }),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "sortBy", void 0);
__decorate([
    IsOptional(),
    IsEnum(SortOrder, { message: "sortOrder must be ASC or DESC" }),
    __metadata("design:type", String)
], QueryProductsDto.prototype, "sortOrder", void 0);
//# sourceMappingURL=query-products.dto.js.map