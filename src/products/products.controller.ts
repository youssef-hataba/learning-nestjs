import { Body, Controller, Get, Param, Post } from "@nestjs/common";

type Product = {
    id: number;
    name: string;
    price: number;
}

// handle req , res 
@Controller()
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

    @Post("products")
    createProduct(@Body() body: { name: string, price: number }) {
        const newProduct: Product = {
            id: this.products.length + 1,
            name: body.name,
            price: body.price,
        }
        this.products.push(newProduct)
        return newProduct
    }

    @Get("products/:id")
    getProductById(@Param("id") id: string) {
        return this.products.find(product => product.id === Number(id))
    }

    @Get("products")
    getAllProducts() {
        return this.products
    }
}