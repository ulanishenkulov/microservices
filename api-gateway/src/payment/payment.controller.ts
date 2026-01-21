import { Controller, Get, Post,Param, UseGuards, Req, HttpException, HttpStatus, Body } from '@nestjs/common';
import { PaymentClient } from './payment.service';
import { JwtGuard } from 'src/guards/jwt.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentClient: PaymentClient) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(@Body() dto: CreatePaymentDto) {
    try {
      return await this.paymentClient.create(dto.orderId);
    } catch (err: any) {
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
}
