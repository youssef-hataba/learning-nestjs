import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { QueryProductsDto } from "./DTOs/query-products.dto.js";
import { Product } from "./product.entity.js";
import { User } from "../users/user.entity.js";
import { PaginatedResult } from "../utils/types.js";
import { applyPagination, buildPaginationMeta } from "../utils/pagination.helper.js";
import { applyProductFilters, applyProductSorting } from "./helpers/product-query.helper.js";

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
        await this.productsRepository.remove(product);
        return {
            message: "Product deleted successfully",
        };
    }
}

