import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { Product } from "../products/product.entity.js";
import { Review } from "../reviews/review.entity.js";

export enum UserType {
    ADMIN = "admin",
    USER = "user",
}

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({
        type: "enum",
        enum: UserType,
        default: UserType.USER,
    })
    userType: UserType;

    @Column({ default: false })
    isAccountVerified: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Product, (product) => product.user)
    products: Relation<Product[]>;

    @OneToMany(() => Review, (review) => review.user)
    reviews: Relation<Review[]>;
}
