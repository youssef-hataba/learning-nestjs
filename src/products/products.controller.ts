import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe } from "@nestjs/common";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { ProductsService } from "./products.service.js";

// handle req , res 
@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    @Get()
    getAllProducts() {
        return this.productsService.getAllProducts();
    }

    @Get(":id")
    getProductById(@Param("id", ParseUUIDPipe) id: string) {
        return this.productsService.getProductById(id);
    }

    @Put(":id")
    updateProduct(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() body: UpdateProductDto
    ) {
        return this.productsService.updateProduct(id, body);
    }

    @Delete(":id")
    deleteProduct(@Param("id", ParseUUIDPipe) id: string) {
        return this.productsService.deleteProduct(id);
    }
}