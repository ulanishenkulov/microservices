import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

import { PaymentClient } from '../payment/payment.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { WebhookResponseDto } from './dto/webhook.response.dto';

@ApiTags('Webhooks / Stripe')
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(private readonly paymentClient: PaymentClient) {}

  @Post()
  @ApiOperation({ summary: 'Handle Stripe payment webhook' })
  @ApiBody({ type: UpdatePaymentDto })
  @ApiResponse({
    status: 200,
    description: 'Webhook received and processed successfully',
    type: WebhookResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid webhook payload',
  })
  async handle(@Body() updatePaymentDto: UpdatePaymentDto) {
    try {
      await this.paymentClient.markPaid(updatePaymentDto);
      return { received: true };
    } catch (err: any) {
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

