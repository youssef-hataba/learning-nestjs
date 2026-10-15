var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as fs from "fs";
import * as path from "path";
import { QueryProductsDto } from "./DTOs/query-products.dto.js";
import { Product } from "./product.entity.js";
import { applyPagination, buildPaginationMeta } from "../utils/pagination.helper.js";
import { applyProductFilters, applyProductSorting } from "./helpers/product-query.helper.js";
import { PRODUCT_IMAGES_DIR } from "./helpers/product-images-upload.helper.js";
let ProductsService = class ProductsService {
    productsRepository;
    constructor(productsRepository) {
        this.productsRepository = productsRepository;
    }
    async createProduct(dto, userId) {
        const newProduct = this.productsRepository.create({
            ...dto,
            images: [],
            user: { id: userId },
        });
        return await this.productsRepository.save(newProduct);
    }
    async getAllProducts(query = new QueryProductsDto()) {
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
    async getProductById(id) {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: { reviews: true, user: true },
        });
        if (!product) {
            throw new NotFoundException(`Product with ID "${id}" not found`);
        }
        return product;
    }
    async updateProduct(id, dto) {
        const product = await this.getProductById(id);
        Object.assign(product, dto);
        return await this.productsRepository.save(product);
    }
    async deleteProduct(id) {
        const product = await this.getProductById(id);
        if (product.images && product.images.length > 0) {
            product.images.forEach((img) => this.deleteImageFileFromDisk(img));
        }
        await this.productsRepository.remove(product);
        return {
            message: "Product deleted successfully",
        };
    }
    async uploadProductImages(id, files) {
        let product;
        try {
            product = await this.getProductById(id);
        }
        catch (error) {
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
    async deleteProductImage(id, filename) {
        const product = await this.getProductById(id);
        if (!product.images || !product.images.includes(filename)) {
            throw new NotFoundException(`Image "${filename}" not found on this product`);
        }
        product.images = product.images.filter((img) => img !== filename);
        await this.productsRepository.save(product);
        this.deleteImageFileFromDisk(filename);
        return {
            message: "Product image deleted successfully",
            images: product.images,
        };
    }
    getProductImagePath(filename) {
        const filePath = path.join(PRODUCT_IMAGES_DIR, filename);
        if (!fs.existsSync(filePath)) {
            throw new NotFoundException(`Product image "${filename}" not found on disk`);
        }
        return filePath;
    }
    deleteImageFileFromDisk(filename) {
        try {
            const filePath = path.join(PRODUCT_IMAGES_DIR, filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            console.error(`Failed to delete product image "${filename}" from disk:`, error);
        }
    }
};
ProductsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Product)),
    __metadata("design:paramtypes", [Repository])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map