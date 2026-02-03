import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { PaymentType } from 'src/payments/enums/payment.enums';
import { UserBalanceReservedEvent } from 'src/events/user-balance-reserved.event';

@Controller('payments')
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get('')
  getAll(@Query() query: GetPaymentsDto) {
    console.log(query)
    return this.service.getAll(query);
  }
}

//kafka
@Controller()
export class PaymentKafkaController {
  constructor(private readonly service: PaymentService) {}

  @EventPattern('orders.created')
  async handleOrderCreated(@Payload() payload: OrderCreatedEvent) {
    if (payload.type !== PaymentType.TOPUP) {
      console.log(`event не TOPUP, event type = ${payload.type} , ничего не сделаем`)
      return;
    }
    console.log(`принял order c id = ${payload.orderId} и type = ${payload.type} для создания payment`);
    await this.service.createPaymentOrderEvent(payload);
  }

  @EventPattern('balance.reserved')
  async handleuserBalanceReserved(@Payload() payload: UserBalanceReservedEvent) {
    if (payload.type === PaymentType.TOPUP) {
      console.log(`event TOPUP, event type = ${payload.type} , ничего не делаем`)
      return;
    }
    console.log(`принял order c id = ${payload.orderId} и type = ${payload.type} для создания payment`);
    await this.service.createPaymentUserbalanceReservedEvent(payload);
  }
}

