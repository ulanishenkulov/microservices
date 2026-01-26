import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { kafkaMicroserviceConfig } from './config/kafka.config';

async function bootstrap() {
  const appContext = await NestFactory.createApplicationContext(AppModule);
  const config = appContext.get(ConfigService);

  const app = await NestFactory.createMicroservice(
    AppModule,
    kafkaMicroserviceConfig(config),
  );

  await app.listen();
}

bootstrap();
