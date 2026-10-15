var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Product } from "../products/product.entity.js";
import { User } from "../users/user.entity.js";
let Review = class Review {
    id;
    rating;
    comment;
    createdAt;
    updatedAt;
    product;
    user;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Review.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Review.prototype, "rating", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Review.prototype, "comment", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Review.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Review.prototype, "updatedAt", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.reviews, { onDelete: "CASCADE", nullable: false }),
    __metadata("design:type", Object)
], Review.prototype, "product", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE", nullable: false }),
    __metadata("design:type", Object)
], Review.prototype, "user", void 0);
Review = __decorate([
    Entity({
        name: "reviews",
    })
], Review);
export { Review };
//# sourceMappingURL=review.entity.js.map