import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { kafkaMicroserviceConfig } from './config/kafka.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('PORT') || 3004;
  await app.listen(port);
  console.log(`HTTP server running on port ${port}`);

  // Kafka microservice
  const kafkaApp = app.connectMicroservice(
    kafkaMicroserviceConfig(configService),
  );
  await kafkaApp.listen();
  console.log('Kafka consumer for PaymentService running');
}

bootstrap();
