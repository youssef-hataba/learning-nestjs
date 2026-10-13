import { Body, Controller, Get, Param, Post, Put, Delete, ParseUUIDPipe, UseGuards, Query } from "@nestjs/common";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { QueryProductsDto } from "./DTOs/query-products.dto.js";
import { ProductsService } from "./products.service.js";
import { AuthGuard } from "../users/guards/auth.guard.js";
import { RolesGuard } from "../users/guards/roles.guard.js";
import { CurrentUser } from "../users/decorators/current-user.decorator.js";
import { Roles } from "../users/decorators/user-role.decorator.js";
import { UserType } from "../utils/enums.js";
import type { JwtPayload, PaginatedResult } from "../utils/types.js";
import { Product } from "./product.entity.js";

@Controller("products")
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Post()
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    createProduct(
        @Body() body: CreateProductDto,
        @CurrentUser() user: JwtPayload,
    ): Promise<Product> {
        return this.productsService.createProduct(body, user.userId);
    }

    @Get()
    getAllProducts(@Query() query: QueryProductsDto): Promise<PaginatedResult<Product>> {
        return this.productsService.getAllProducts(query);
    }

    @Get(":id")
    getProductById(@Param("id", ParseUUIDPipe) id: string): Promise<Product> {
        return this.productsService.getProductById(id);
    }

    @Put(":id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    updateProduct(
        @Param("id", ParseUUIDPipe) id: string,
        @Body() body: UpdateProductDto
    ): Promise<Product> {
        return this.productsService.updateProduct(id, body);
    }

    @Delete(":id")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteProduct(@Param("id", ParseUUIDPipe) id: string): Promise<{ message: string }> {
        return this.productsService.deleteProduct(id);
    }
}