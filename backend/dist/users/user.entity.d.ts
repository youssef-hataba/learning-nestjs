import type { Relation } from "typeorm";
import { Product } from "../products/product.entity.js";
import { Review } from "../reviews/review.entity.js";
import { UserType } from "../utils/enums.js";
export declare class User {
    id: string;
    username: string;
    email: string;
    password: string;
    userType: UserType;
    isAccountVerified: boolean;
    profileImage: string | null;
    createdAt: Date;
    updatedAt: Date;
    deletedByAdmin: boolean;
    deletedAt: Date | null;
    products: Relation<Product[]>;
    reviews: Relation<Review[]>;
}
