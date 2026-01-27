import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const kafkaMicroserviceConfig = (
  config: ConfigService,
): MicroserviceOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: config.getOrThrow<string>('KAFKA_CLIENT_ID'),
      brokers: config.getOrThrow<string>('KAFKA_BROKERS')!.split(','),
    },
    consumer: {
      groupId: config.getOrThrow<string>('KAFKA_GROUP_ID'),
    },
  },
});
