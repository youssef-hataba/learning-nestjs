import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany } from "typeorm";
import type { Relation } from "typeorm";
import { Product } from "../products/product.entity.js";
import { Review } from "../reviews/review.entity.js";
import { UserType } from "../utils/enums.js";

@Entity({
    name: "users",
})
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false, type: "varchar", nullable: true, default: null })
    password: string | null;

    @Column({ nullable: true, unique: true, type: "varchar", default: null })
    googleId: string | null;

    @Column({
        type: "enum",
        enum: UserType,
        default: UserType.USER,
        select: false,
    })
    userType: UserType;

    @Column({ default: false })
    isAccountVerified: boolean;

    @Column({ nullable: true, type: "varchar", default: null })
    profileImage: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ default: false })
    deletedByAdmin: boolean;

    @DeleteDateColumn()
    deletedAt: Date | null;

    @OneToMany(() => Product, (product) => product.user)
    products: Relation<Product[]>;

    @OneToMany(() => Review, (review) => review.user)
    reviews: Relation<Review[]>;
}
