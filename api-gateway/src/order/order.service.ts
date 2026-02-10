import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateOrderPayloadDto } from './dto/create-order-payload.dto';

@Injectable()
export class OrderClient {
    private readonly orderUrl: string;
    constructor(private readonly http: HttpService,
              private readonly configService: ConfigService,
  ) {
    this.orderUrl = this.configService.getOrThrow<string>('ORDER_SERVICE_URL');
  }

  async create(orderPayload: CreateOrderPayloadDto,key:string) {
    const res = await axios.post(
      this.orderUrl, 
      orderPayload,
      {headers: {'idempotency-key': key}}
    );
    return res.data;
  }

  async findById(orderId: string) {
    const res = await axios.get(`${this.orderUrl}/${orderId}`);
    return res.data;
  }

    async markPaid(orderId: string) {
    const res = await axios.patch(`${this.orderUrl}/${orderId}/paid`);
    return res.data;
  }
}
