import { Transport, KafkaOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

export const kafkaProducerConfig = (config: ConfigService): KafkaOptions => ({
  transport: Transport.KAFKA,
  options: {
    client: {
      clientId: config.getOrThrow<string>('KAFKA_CLIENT_ID'),
      brokers: config.getOrThrow<string>('KAFKA_BROKERS').split(','),
    },
    producerOnlyMode: true,
  },
});
