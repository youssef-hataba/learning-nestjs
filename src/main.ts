import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix("api");
  // Global Validation Pipe configuration
  app.useGlobalPipes(new ValidationPipe({
    // Automatically strips away any properties that are not explicitly defined in the DTO
    whitelist: true,
    // Throws a 400 Bad Request error if the client sends unexpected or unwhitelisted properties
    forbidNonWhitelisted: true,
    // Automatically converts plain HTTP request payloads and query strings into typed DTO class instances
    transform: true,
  }));
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
await bootstrap();
