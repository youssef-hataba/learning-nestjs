import type { Relation } from "typeorm";
import { Product } from "../products/product.entity.js";
import { User } from "../users/user.entity.js";
export declare class Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: Date;
    updatedAt: Date;
    product: Relation<Product>;
    user: Relation<User>;
}
