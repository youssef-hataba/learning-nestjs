import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { QueryProductsDto } from "./DTOs/query-products.dto.js";
import { Product } from "./product.entity.js";
import { User } from "../users/user.entity.js";
import { PaginatedResult } from "../utils/types.js";
import { applyPagination, buildPaginationMeta } from "../utils/pagination.helper.js";
import { applyProductFilters, applyProductSorting } from "./helpers/product-query.helper.js";
import { PRODUCT_IMAGES_DIR } from "./helpers/product-images-upload.helper.js";

export type PaginatedProductsResponse = PaginatedResult<Product>;

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) { }

    async createProduct(dto: CreateProductDto, userId: string): Promise<Product> {
        const newProduct = this.productsRepository.create({
            ...dto,
            images: [],
            user: { id: userId } as User,
        });
        return await this.productsRepository.save(newProduct);
    }

    async getAllProducts(query: QueryProductsDto = new QueryProductsDto()): Promise<PaginatedResult<Product>> {
        const { page = 1, limit = 10 } = query;

        const queryBuilder = this.productsRepository
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.reviews", "reviews")
            .leftJoinAndSelect("product.user", "user");

        applyProductFilters(queryBuilder, query);
        applyProductSorting(queryBuilder, query.sortBy, query.sortOrder);
        applyPagination(queryBuilder, page, limit);

        const [items, total] = await queryBuilder.getManyAndCount();

        return {
            data: items,
            meta: buildPaginationMeta(total, page, limit),
        };
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: { reviews: true, user: true },
        });

        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }

        return product;
    }

    async updateProduct(id: string, dto: UpdateProductDto): Promise<Product> {
        const product = await this.getProductById(id);
        // Copies all provided fields from dto into product entity (partial update / mutation)
        Object.assign(product, dto);
        return await this.productsRepository.save(product);
    }

    async deleteProduct(id: string): Promise<{ message: string }> {
        const product = await this.getProductById(id);

        // Delete all associated image files from disk
        if (product.images && product.images.length > 0) {
            product.images.forEach((img) => this.deleteImageFileFromDisk(img));
        }

        await this.productsRepository.remove(product);
        return {
            message: "Product deleted successfully",
        };
    }

    // ==========================================
    // 🖼️ PRODUCT IMAGES MANAGEMENT
    // ==========================================

    async uploadProductImages(
        id: string,
        files: Express.Multer.File[]
    ): Promise<{ message: string; images: string[] }> {
        let product: Product;
        try {
            product = await this.getProductById(id);
        } catch (error) {
            // Clean up newly uploaded files if product doesn't exist
            files.forEach((file) => this.deleteImageFileFromDisk(file.filename));
            throw error;
        }

        const newFilenames = files.map((file) => file.filename);
        product.images = [...(product.images || []), ...newFilenames];
        const saved = await this.productsRepository.save(product);

        return {
            message: `${files.length} image(s) uploaded successfully`,
            images: saved.images,
        };
    }

    async deleteProductImage(
        id: string,
        filename: string
    ): Promise<{ message: string; images: string[] }> {
        const product = await this.getProductById(id);

        if (!product.images || !product.images.includes(filename)) {
            throw new NotFoundException(`Image "${filename}" not found on this product`);
        }

        product.images = product.images.filter((img) => img !== filename);
        await this.productsRepository.save(product);

        // Delete file from disk
        this.deleteImageFileFromDisk(filename);

        return {
            message: "Product image deleted successfully",
            images: product.images,
        };
    }

    getProductImagePath(filename: string): string {
        const filePath = path.join(PRODUCT_IMAGES_DIR, filename);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException(`Product image "${filename}" not found on disk`);
        }
        return filePath;
    }

    private deleteImageFileFromDisk(filename: string): void {
        try {
            const filePath = path.join(PRODUCT_IMAGES_DIR, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (error) {
            console.error(`Failed to delete product image "${filename}" from disk:`, error);
        }
    }
}

