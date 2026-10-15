var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { Review } from "../reviews/review.entity.js";
import { User } from "../users/user.entity.js";
let Product = class Product {
    id;
    title;
    description;
    price;
    images;
    createdAt;
    updatedAt;
    reviews;
    user;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], Product.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "title", void 0);
__decorate([
    Column(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    Column("text", { array: true, default: "{}" }),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], Product.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], Product.prototype, "updatedAt", void 0);
__decorate([
    OneToMany(() => Review, (review) => review.product),
    __metadata("design:type", Object)
], Product.prototype, "reviews", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE", nullable: false }),
    __metadata("design:type", Object)
], Product.prototype, "user", void 0);
Product = __decorate([
    Entity({
        name: "products"
    })
], Product);
export { Product };
//# sourceMappingURL=product.entity.js.map