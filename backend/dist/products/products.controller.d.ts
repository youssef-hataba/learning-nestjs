import type { Response } from "express";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { QueryProductsDto } from "./DTOs/query-products.dto.js";
import { ProductsService } from "./products.service.js";
import type { JwtPayload, PaginatedResult } from "../utils/types.js";
import { Product } from "./product.entity.js";
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    createProduct(body: CreateProductDto, user: JwtPayload): Promise<Product>;
    getAllProducts(query: QueryProductsDto): Promise<PaginatedResult<Product>>;
    getProductImage(filename: string, res: Response): void;
    getProductById(id: string): Promise<Product>;
    updateProduct(id: string, body: UpdateProductDto): Promise<Product>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    uploadProductImages(id: string, files?: Express.Multer.File[]): Promise<{
        message: string;
        images: string[];
    }>;
    deleteProductImage(id: string, filename: string): Promise<{
        message: string;
        images: string[];
    }>;
}
