import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return "🟢 Hello World! Welcome to the API.✈️💥🚀🔥";
  }
}
