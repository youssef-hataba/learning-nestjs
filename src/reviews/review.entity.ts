import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import { Product } from "../products/product.entity.js";
import { User } from "../users/user.entity.js";

@Entity({
    name: "reviews",
})
export class Review {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    rating: number;

    @Column()
    comment: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Product, (product) => product.reviews, { onDelete: "CASCADE" })
    product: Relation<Product>;

    @ManyToOne(() => User, (user) => user.reviews, { onDelete: "CASCADE" })
    user: Relation<User>;
}
