import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete,
    ParseUUIDPipe,
    UseGuards,
    Query,
    UseInterceptors,
    UploadedFiles,
    BadRequestException,
    Res,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import type { Response } from "express";
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
import { productImagesUploadOptions, MAX_PRODUCT_IMAGES } from "./helpers/product-images-upload.helper.js";

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

    // ==========================================
    // 🖼️ PRODUCT IMAGES (Declared before :id to prevent UUID parse collision)
    // ==========================================
    @Get("images/:filename")
    async getProductImage(
        @Param("filename") filename: string,
        @Res() res: Response,
    ) {
        const imageUrl = await this.productsService.findProductImageUrl(filename);
        return res.redirect(imageUrl);
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

    @Post(":id/images")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    @UseInterceptors(FilesInterceptor("images", MAX_PRODUCT_IMAGES, productImagesUploadOptions))
    uploadProductImages(
        @Param("id", ParseUUIDPipe) id: string,
        @UploadedFiles() files?: Express.Multer.File[],
    ): Promise<{ message: string; images: string[] }> {
        if (!files || files.length === 0) {
            throw new BadRequestException("At least one product image file is required");
        }
        return this.productsService.uploadProductImages(id, files);
    }

    @Delete(":id/images/:filename")
    @Roles(UserType.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    deleteProductImage(
        @Param("id", ParseUUIDPipe) id: string,
        @Param("filename") filename: string,
    ): Promise<{ message: string; images: string[] }> {
        return this.productsService.deleteProductImage(id, filename);
    }
}
