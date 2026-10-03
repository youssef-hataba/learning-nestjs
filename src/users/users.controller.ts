import { Controller, Get } from "@nestjs/common";

@Controller()
export class UsersController {
    @Get("users")
    getAllUsers() {
        return [
            {
                id: 1,
                name: "User 1",
            },
            {
                id: 2,
                name: "User 2",
            },
        ]
    }
}