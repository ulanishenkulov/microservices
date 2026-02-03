import { Controller, Get, Param, Delete } from '@nestjs/common';
import { UsersService } from './user.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsCompletedEvent } from 'src/events/payments-completed.event';
import { EventType } from 'src/types/payment.enums';
import { OrderCreatedEvent } from 'src/events/order-created.event';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

@Controller()
export class UserKafkaController {
  constructor(private readonly usersService: UsersService) {}

  @EventPattern('payments.completed')
  async handlePaymentCompleted(@Payload() payload: PaymentsCompletedEvent) {
    if (payload.type === EventType.TOPUP) {
      console.log(`принял payments.completed topic для topUp balance user - ${payload.userId} paymentId - ${payload.paymentId}`);
      await this.usersService.topUpUser(payload);
    }else if (payload.type === EventType.WITHDRAW || payload.type === EventType.PRODUCT) {
      console.log(`принял payments.completed topic для WITHDRAW balance user - ${payload.userId} paymentId - ${payload.paymentId}`);
      await this.usersService.decreaseUserBalance(payload);
    }else {
      console.log(`принял payments.completed topic но ничего не сделал- ${payload.userId} paymentId - ${payload.paymentId}, type = ${payload.type}`);
      return
    }
  }

  @EventPattern('orders.created')
  async handleOrderCreated(@Payload() payload: OrderCreatedEvent) {
    if (payload.type === EventType.TOPUP) {
      console.log(`event TOPUP ничего не делаем , event type = ${payload.type} , ничего не сделаем`)
      return;
    }
    console.log(`принял order c id = ${payload.orderId} и type = ${payload.type} резерва баланса`);
    await this.usersService.reserveUserBalance(payload);
  }
}
