import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import { Review } from "../reviews/review.entity.js";
import { User } from "../users/user.entity.js";

@Entity({
    name: "products"
})
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column("text", { array: true, default: "{}" })
    images: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Review, (review) => review.product)
    reviews: Relation<Review[]>;

    @ManyToOne(() => User, (user) => user.products, { onDelete: "CASCADE", nullable: false })
    user: Relation<User>;
}
