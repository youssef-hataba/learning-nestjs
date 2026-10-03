import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller.js";


@Module({
    imports: [],
    controllers: [ProductsController],
    providers: [],
    exports: [],
})
export class ProductsModule { }