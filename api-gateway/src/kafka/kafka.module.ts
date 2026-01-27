import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaProducerService } from './kafka-producer.service';
import { kafkaProducerConfig } from '../config/kafka-producer.config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.registerAsync([
      {
        name: process.env.KAFKA_CLIENT_NAME || 'KAFKA_CLIENT',
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          ...kafkaProducerConfig(config)
        }),
      },
    ]),
  ],
  providers: [KafkaProducerService],
  exports: [KafkaProducerService],
})
export class KafkaModule {}
