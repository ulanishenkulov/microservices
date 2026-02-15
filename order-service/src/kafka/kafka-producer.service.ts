import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { OrderCreatedEvent } from 'src/events/order-created.event';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject(process.env.KAFKA_CLIENT_NAME || 'KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async emitOrderCreated(
    payload: OrderCreatedEvent,
    options?: { headers?: Record<string, string> },
  ) {
    return this.kafka.emit('orders.created', {
      value: payload,
      headers: options?.headers,
    });
  }
}
