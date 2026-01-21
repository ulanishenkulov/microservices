import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OrderClient {
    private readonly orderUrl: string;
    constructor(private readonly http: HttpService,
              private readonly configService: ConfigService,
  ) {
    this.orderUrl = this.configService.getOrThrow<string>('ORDER_SERVICE_URL');
  }

  async create(userId: string) {
    const res = await axios.post(this.orderUrl,{ userId });
    return res.data;
  }

  async findById(orderId: string) {
    const res = await axios.get(`${this.orderUrl}/${orderId}`);
    return res.data;
  }
}

