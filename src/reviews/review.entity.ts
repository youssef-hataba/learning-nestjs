import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import { Product } from "../products/product.entity.js";

@Entity({
    name: "reviews",
})
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

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
}
