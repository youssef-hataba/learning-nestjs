import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  app.setGlobalPrefix("api");
  // Global Validation Pipe
  // whitelist : removes properties that are not in the DTO
  // forbidNonWhitelisted : throws an error if properties that are not in the DTO are found
  // transform : transforms the payload to the DTO type
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
await bootstrap();
