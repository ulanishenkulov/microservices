import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class PaymentClient {
  private readonly paymentUrl: string;
  private readonly apiKey: string;
  constructor(private readonly configService: ConfigService) {
    this.paymentUrl = this.configService.getOrThrow<string>('PAYMENT_SERVICE_URL');
    this.apiKey = this.configService.getOrThrow<string>('API_GATEWAY_SECRET');
  }

  async create(orderId: string) {
    const res = await axios.post(`${this.paymentUrl}/payments`,{ orderId });
    return res.data;
  }

  async markPaid(paymentId: string) {
    const res = await axios.patch(`${this.paymentUrl}/internal/payments/${paymentId}/paid`,null,{
        headers: { 'x-api-key': this.apiKey },
      });
    return res.data;
  }
}

