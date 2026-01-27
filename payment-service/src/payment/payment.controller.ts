import { Controller, Post, Body } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { StripeReceivedEvent } from 'src/events/stripe-received.event';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Post('')
  create(@Body() dto: CreatePaymentDto) {
    return this.service.create(dto.orderId);
  }
}

//kafka
@Controller()
export class PaymentKafkaController {
  constructor(private readonly service: PaymentService) {}

  @EventPattern('payments.stripe.webhook.received')
  async handlePaymentCompleted(@Payload() payload: StripeReceivedEvent) {
    console.log(`принял paymentId для update ${payload.paymentId}`)
    await this.service.markPaid(payload.paymentId);
  }
}

