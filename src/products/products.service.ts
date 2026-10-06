import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { Repository } from "typeorm";
import { Product } from "./product.entity.js";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>
    ) { }

    async createProduct(dto: CreateProductDto) {
        const newProduct = this.productsRepository.create(dto)
        return await this.productsRepository.save(newProduct)
    }

    async getAllProducts() {
        return await this.productsRepository.find() // return all products 
    }

    async getProductById(id: number) :Promise<Product> {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        return product;
    }

    async updateProduct(id: number, dto: UpdateProductDto): Promise<Product> {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        product.title = dto.title ?? product.title;
        product.description = dto.description ?? product.description;
        product.price = dto.price ?? product.price;
        return await this.productsRepository.save(product);
    }

    async deleteProduct(id: number) {
        const product = await this.productsRepository.findOneBy({ id });
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        await this.productsRepository.remove(product);
        return {
            message: "Product deleted successfully",
        };
    }
}
