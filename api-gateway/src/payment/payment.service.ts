import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { StripeReceivedEvent } from 'src/events/stripe-recevied.event';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { UpdatePaymentDto } from 'src/webhooks/dto/update-payment.dto';

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

  async markPaid(updatePaymentDto: UpdatePaymentDto) {
    await axios.patch(`${this.paymentUrl}/internal/payments/${updatePaymentDto.paymentId}/paid`,
      { type: updatePaymentDto.type }, 
      { headers: {'x-api-key': this.apiKey}
    });
  }
}

