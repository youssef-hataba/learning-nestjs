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
import { CloudinaryService } from "../cloudinary/cloudinary.service.js";

export type PaginatedProductsResponse = PaginatedResult<Product>;

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        private readonly cloudinaryService: CloudinaryService,
    ) {}

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

        const [data, totalItems] = await queryBuilder.getManyAndCount();
        const meta = buildPaginationMeta(page, limit, totalItems);

        return { data, meta };
    }

    async getProductById(id: string): Promise<Product> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: {
                reviews: {
                    user: true,
                },
                user: true,
            },
        });
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        return product;
    }

    async updateProduct(id: string, body: UpdateProductDto): Promise<Product> {
        const product = await this.getProductById(id);
        const updated = Object.assign(product, body);
        return await this.productsRepository.save(updated);
    }

    async deleteProduct(id: string): Promise<{ message: string }> {
        const product = await this.getProductById(id);

        // Delete all associated product images from Cloudinary
        if (product.images && product.images.length > 0) {
            await Promise.all(
                product.images.map((imgUrl) => this.cloudinaryService.deleteImage(imgUrl))
            );
        }

        await this.productsRepository.remove(product);
        return {
            message: "Product deleted successfully",
        };
    }

    // ==========================================
    // 🖼️ PRODUCT IMAGES MANAGEMENT (Cloudinary)
    // ==========================================

    async uploadProductImages(
        id: string,
        files: Express.Multer.File[]
    ): Promise<{ message: string; images: string[] }> {
        const product = await this.getProductById(id);

        // Stream each image buffer to Cloudinary concurrently
        const uploadPromises = files.map((file) =>
            this.cloudinaryService.uploadImage(file, "planto/products")
        );
        const uploadResults = await Promise.all(uploadPromises);
        const newImageUrls = uploadResults.map((res) => res.secure_url);

        product.images = [...(product.images || []), ...newImageUrls];
        const saved = await this.productsRepository.save(product);

        return {
            message: `${files.length} image(s) uploaded successfully`,
            images: saved.images,
        };
    }

    async deleteProductImage(
        id: string,
        imageIdentifier: string
    ): Promise<{ message: string; images: string[] }> {
        const product = await this.getProductById(id);

        const targetImage = (product.images || []).find(
            (img) => img === imageIdentifier || img.includes(imageIdentifier)
        );

        if (!targetImage) {
            throw new NotFoundException(`Image "${imageIdentifier}" not found on this product`);
        }

        // Delete from Cloudinary
        await this.cloudinaryService.deleteImage(targetImage);

        // Remove from database
        product.images = product.images.filter((img) => img !== targetImage);
        await this.productsRepository.save(product);

        return {
            message: "Product image deleted successfully",
            images: product.images,
        };
    }

    async findProductImageUrl(filename: string): Promise<string> {
        const product = await this.productsRepository
            .createQueryBuilder("product")
            .where("array_to_string(product.images, ',') LIKE :filename", { filename: `%${filename}%` })
            .getOne();

        const match = product?.images?.find((img) => img.includes(filename));
        if (!match) {
            throw new NotFoundException(`Product image "${filename}" not found`);
        }
        return match;
    }
}
