import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { PaymentsCompletedEvent } from 'src/events/payments-completed.event';

//api
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto.userId);
  }

  @Patch(':id/paid')
  markPaid(@Param('id') id: string) {
    return this.service.markPaid(id);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.findById(id);
  }
}

//kafka
@Controller()
export class OrderKafkaController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern('payments.completed')
  async handlePaymentCompleted(@Payload() payload: PaymentsCompletedEvent) {
    await this.orderService.markPaid(payload.orderId);
  }
}
