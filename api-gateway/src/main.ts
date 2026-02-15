import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { swaggerConfig } from './config/swagger.config';
import { requestIdMiddleware } from './middleware/request-id.middleware';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
  }));
  app.use(requestIdMiddleware);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT') || 3000;

  const document = SwaggerModule.createDocument(app, swaggerConfig(configService));
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
}
bootstrap();
