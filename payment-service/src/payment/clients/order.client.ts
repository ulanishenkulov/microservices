import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from 'axios';

@Injectable()
export class OrderClient {
  private readonly orderUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.orderUrl = this.configService.getOrThrow<string>('ORDER_SERVICE_URL');
  }

  async findById(orderId: string) {
    try {
      const res = await axios.get(`${this.orderUrl}/${orderId}`);
      return res.data;
    }catch(err:any){
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async markPaid(orderId: string) {
    try {
      await axios.patch(`${this.orderUrl}/${orderId}/paid`);
    }catch(err:any){
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
