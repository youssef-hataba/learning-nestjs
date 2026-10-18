var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import { Product } from "../products/product.entity.js";
import { Review } from "../reviews/review.entity.js";
import { UserType } from "../utils/enums.js";
let User = class User {
    id;
    username;
    email;
    password;
    googleId;
    userType;
    isAccountVerified;
    profileImage;
    createdAt;
    updatedAt;
    deletedByAdmin;
    deletedAt;
    products;
    reviews;
};
__decorate([
    PrimaryGeneratedColumn("uuid"),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Column({ select: false, type: "varchar", nullable: true, default: null }),
    __metadata("design:type", Object)
], User.prototype, "password", void 0);
__decorate([
    Column({ nullable: true, unique: true, type: "varchar", default: null }),
    __metadata("design:type", Object)
], User.prototype, "googleId", void 0);
__decorate([
    Column({
        type: "enum",
        enum: UserType,
        default: UserType.USER,
        select: false,
    }),
    __metadata("design:type", String)
], User.prototype, "userType", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isAccountVerified", void 0);
__decorate([
    Column({ nullable: true, type: "varchar", default: null }),
    __metadata("design:type", Object)
], User.prototype, "profileImage", void 0);
__decorate([
    CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "deletedByAdmin", void 0);
__decorate([
    DeleteDateColumn(),
    __metadata("design:type", Object)
], User.prototype, "deletedAt", void 0);
__decorate([
    OneToMany(() => Product, (product) => product.user),
    __metadata("design:type", Object)
], User.prototype, "products", void 0);
__decorate([
    OneToMany(() => Review, (review) => review.user),
    __metadata("design:type", Object)
], User.prototype, "reviews", void 0);
User = __decorate([
    Entity({
        name: "users",
    })
], User);
export { User };
//# sourceMappingURL=user.entity.js.map