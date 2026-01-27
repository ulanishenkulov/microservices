import { Controller, Get, Post,Param, UseGuards, Req, HttpException, HttpStatus, Body } from '@nestjs/common';
import { PaymentClient } from './payment.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentClient: PaymentClient) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
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
