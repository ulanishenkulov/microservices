import {
  Controller,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { PaymentClient } from './payment.service';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { UserRole } from 'src/enums/user-role.enum';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment.response.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentClient: PaymentClient) {}

  @Post()
  @ApiOperation({ summary: 'Create payment for order' })
  @ApiResponse({
    status: 201,
    description: 'Payment created',
    type: PaymentResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid order or order already paid',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USER)
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentClient.create(dto.orderId);
  }
}

