import { DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

export const swaggerConfig = (config: ConfigService) =>
  new DocumentBuilder()
    .setTitle(config.get('SWAGGER_TITLE', 'API Gateway'))
    .setDescription(config.get('SWAGGER_DESCRIPTION', 'Public API for clients'))
    .setVersion(config.get('SWAGGER_VERSION', '1.0'))
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();
