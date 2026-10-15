import { Repository } from "typeorm";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { QueryProductsDto } from "./DTOs/query-products.dto.js";
import { Product } from "./product.entity.js";
import { PaginatedResult } from "../utils/types.js";
export type PaginatedProductsResponse = PaginatedResult<Product>;
export declare class ProductsService {
    private readonly productsRepository;
    constructor(productsRepository: Repository<Product>);
    createProduct(dto: CreateProductDto, userId: string): Promise<Product>;
    getAllProducts(query?: QueryProductsDto): Promise<PaginatedResult<Product>>;
    getProductById(id: string): Promise<Product>;
    updateProduct(id: string, dto: UpdateProductDto): Promise<Product>;
    deleteProduct(id: string): Promise<{
        message: string;
    }>;
    uploadProductImages(id: string, files: Express.Multer.File[]): Promise<{
        message: string;
        images: string[];
    }>;
    deleteProductImage(id: string, filename: string): Promise<{
        message: string;
        images: string[];
    }>;
    getProductImagePath(filename: string): string;
    private deleteImageFileFromDisk;
}
