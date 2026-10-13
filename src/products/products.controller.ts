import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, UseGuards } from "@nestjs/common";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { ProductsService } from "./products.service.js";
import { AuthGuard } from "../users/guards/auth.guard.js";
import { RolesGuard } from "../users/guards/roles.guard.js";
import { CurrentUser } from "../users/decorators/current-user.decorator.js";
import { Roles } from "../users/decorators/user-role.decorator.js";
import { UserType } from "../utils/enums.js";
import type { JwtPayload } from "../utils/types.js";

// handle req , res 
@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    createProduct(
        @Body() body: CreateProductDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.productsService.createProduct(body, user.userId);
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