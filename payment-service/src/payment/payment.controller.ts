import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Ctx, EventPattern, KafkaContext, Payload } from '@nestjs/microservices';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { PaymentType } from 'src/payments/enums/payment.enums';
import { UserBalanceReservedEvent } from 'src/events/user-balance-reserved.event';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';

@Controller('payments')
export class PaymentController {
  constructor(
    private readonly service: PaymentService,
  ) {}

  @Get('')
  getAll(@Query() query: GetPaymentsDto) {
    return this.service.getAll(query);
  }
}

//kafka
@Controller()
export class PaymentKafkaController {
  constructor(
    private readonly service: PaymentService,
    private readonly kafkaProducer: KafkaProducerService
  ) {}

  @EventPattern('orders.created')
  async handleOrderCreated(@Payload() payload: OrderCreatedEvent,  @Ctx() context: KafkaContext,) {
     const headers = context.getMessage().headers;
     const retryCount = Number(headers?.['retry-count']?.toString() ?? 0);
     const requestId  = headers?.['x-request-id'].toString();
    if (payload.type !== PaymentType.TOPUP) {
      console.log(`event не TOPUP, event type = ${payload.type}, requestId = ${requestId} ничего не сделаем`)
      return;
    }
    try {
        console.log(
          `принял order c id = ${payload.orderId} и type = ${payload.type} для создания payment, retryCount = ${retryCount},requestId = ${requestId}`
        );
        await this.service.createPaymentOrderEvent(payload);
    }catch(err) {
      if (retryCount >= 5) {
      console.error(
        `❌ PaymentService: max retry reached for order=${payload.orderId} and requestId = ${requestId}`,
      );
      // 🔜 позже: отправим в DLQ
      return; // ⛔ offset КОММИТИТСЯ
    }
      console.warn(
       `🔁 PaymentService retry ${retryCount + 1}/5 for order=${payload.orderId} and requestId = ${requestId}`,
    );

      // публикуем снова с увеличенным retry
      await this.kafkaProducer.emitOrderCreated(payload, {
        headers: {
            'retry-count': String(retryCount + 1),
            'x-request-id': requestId,
        },
      });
      return;
    }
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

