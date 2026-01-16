import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  await app.listen(3000);
}
bootstrap();
