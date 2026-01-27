import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { StripeReceivedEvent } from 'src/events/stripe-recevied.event';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject(process.env.KAFKA_CLIENT_NAME || 'KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async emitStripeWebhookReceived(payload: StripeReceivedEvent) {
    return this.kafka.emit('payments.stripe.webhook.received', payload);
  }
}
