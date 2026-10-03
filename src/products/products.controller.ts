import { Controller, Get } from "@nestjs/common";

// handle req , res 
@Controller()
export class ProductsController {
    @Get("products")
    getAllProducts() {
        return [
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
    }
}