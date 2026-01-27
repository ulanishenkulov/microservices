import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { StripeReceivedEvent } from 'src/events/stripe-recevied.event';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';

@Injectable()
export class PaymentClient {
  private readonly paymentUrl: string;
  private readonly apiKey: string;
  constructor(
    private readonly configService: ConfigService,
    private readonly kafkaProducer: KafkaProducerService,) {
    this.paymentUrl = this.configService.getOrThrow<string>('PAYMENT_SERVICE_URL');
    this.apiKey = this.configService.getOrThrow<string>('API_GATEWAY_SECRET');
  }

  async create(orderId: string) {
    const res = await axios.post(`${this.paymentUrl}/payments`,{ orderId });
    return res.data;
  }

  async markPaid(paymentId: string) {
    const event: StripeReceivedEvent = {
      paymentId
    };
    console.log(`try to emit ${paymentId} in webhooks route`)
    //отправляем событие в Kafka
    this.kafkaProducer.emitStripeWebhookReceived(event).catch((err) => {
    console.error('Kafka emit error (payments.stripe.webhook.received):', err);
    });
  }
}

