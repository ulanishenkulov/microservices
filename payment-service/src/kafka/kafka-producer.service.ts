import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { PaymentsCompletedEvent } from 'src/events/payments-completed.event';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject(process.env.KAFKA_CLIENT_NAME || 'KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async emitPaymentCompleted(payload: PaymentsCompletedEvent) {
    return this.kafka.emit('payments.completed', payload);
  }
}
