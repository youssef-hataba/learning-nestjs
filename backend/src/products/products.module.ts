import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller.js";
import { ProductsService } from "./products.service.js";
import { UsersModule } from "../users/users.module.js";
import { Product } from "./product.entity.js";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    controllers: [ProductsController],
    providers: [ProductsService],
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([Product]),
    ],
    exports: [ProductsService],
})
export class ProductsModule { }