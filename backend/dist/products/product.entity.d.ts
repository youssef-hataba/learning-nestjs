import type { Relation } from "typeorm";
import { Review } from "../reviews/review.entity.js";
import { User } from "../users/user.entity.js";
export declare class Product {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
    reviews: Relation<Review[]>;
    user: Relation<User>;
}
