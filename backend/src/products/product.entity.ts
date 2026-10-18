import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from "typeorm";
import type { Relation } from "typeorm";
import { Review } from "../reviews/review.entity.js";
import { User } from "../users/user.entity.js";
import { PlantPlacement, LightRequirement, WateringFrequency, CareLevel } from "../utils/enums.js";

@Entity({
    name: "products"
})
export class Product {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true, type: "varchar", default: null })
    scientificName: string | null;

    @Column()
    description: string;

    @Column()
    price: number;

    @Column({ default: 0 })
    stock: number;

    @Column({
        type: "enum",
        enum: PlantPlacement,
        default: PlantPlacement.INDOOR,
    })
    placement: PlantPlacement;

    @Column({
        type: "enum",
        enum: LightRequirement,
        default: LightRequirement.INDIRECT_BRIGHT,
    })
    lightRequirement: LightRequirement;

    @Column({
        type: "enum",
        enum: WateringFrequency,
        default: WateringFrequency.MODERATE,
    })
    wateringFrequency: WateringFrequency;

    @Column({
        type: "enum",
        enum: CareLevel,
        default: CareLevel.EASY,
    })
    careLevel: CareLevel;

    @Column({ default: false })
    isPetFriendly: boolean;

    @Column({ nullable: true, type: "varchar", default: null })
    humidity: string | null;

    @Column({ nullable: true, type: "varchar", default: null })
    potSize: string | null;

    @Column({ nullable: true, type: "varchar", default: null })
    category: string | null;

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
