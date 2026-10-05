import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";
import { Review, ReviewsService } from "../reviews/reviews.service.js";

export type Product = {
    id: number;
    name: string;
    price: number;
}

@Injectable()
export class ProductsService {
    constructor (private readonly reviewService: ReviewsService) {}

    private products: Product[] = [
        {
            id: 1,
            name: "Product 1",
            price: 100,
        },
        {
            id: 2,
            name: "Product 2",
            price: 200,
        },
    ];

    createProduct(body: CreateProductDto): Product {
        const newProduct: Product = {
            id: this.products.length + 1,
            name: body.name,
            price: body.price,
        };
        this.products.push(newProduct);
        return newProduct;
    }

    getAllProducts(): (Product & { review: {rating:number,text:string} | null })[] {
        const reviews = this.reviewService.getAllReviews();
        return this.products.map(product => {
            const review = reviews.find(r => r.id === product.id);
            return {
                ...product,
                review: review ? {rating: review.rating, text: review.text} : null,
            };
        });
    }

    getProductById(id: number): Product {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        return product;
    }

    updateProduct(id: number, body: UpdateProductDto): Product {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        product.name = body.name || product.name;
        product.price = body.price || product.price;
        return product;
    }

    deleteProduct(id: number) {
        const product = this.products.find(product => product.id === id);
        if (!product) {
            throw new NotFoundException("Product not found");
        }
        this.products = this.products.filter(product => product.id !== id);
        return {
            message: "Product deleted successfully",
        };
    }
}
