import { Body, Controller, Get, Param, Post, NotFoundException, Put, Delete } from "@nestjs/common";
import { CreateProductDto } from "./DTOs/create-product.dto.js";
import { UpdateProductDto } from "./DTOs/update-product.dto.js";

type Product = {
    id: number;
    name: string;
    price: number;
}

// handle req , res 
@Controller("products")
export class ProductsController {
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
    ]

    @Post()
    createProduct(@Body() body: CreateProductDto) {
        const newProduct: Product = {
            id: this.products.length + 1,
            name: body.name,
            price: body.price,
        }
        this.products.push(newProduct)
        return newProduct
    }

    @Get()
    getAllProducts() {
        return this.products
    }

    @Get(":id")
    getProductById(@Param("id") id: string) {
        const product = this.products.find(product => product.id === Number(id))
        if(!product){
            throw new NotFoundException("Product not found")
        }
        return product
    }

    @Put(":id")
    updateProduct(@Param("id") id: string, @Body() body: UpdateProductDto) {
        const product = this.products.find(product => product.id === Number(id))
        if(!product){
            throw new NotFoundException("Product not found")
        }
        product.name = body.name || product.name
        product.price = body.price || product.price
        return product
    }

    @Delete(":id")
    deleteProduct(@Param("id") id: string) {
        const product = this.products.find(product => product.id === Number(id))
        if(!product){
            throw new NotFoundException("Product not found")
        }
        this.products = this.products.filter(product => product.id !== Number(id))
        return {
            message: "Product deleted successfully",
        }
    }
}