import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { UserBalanceUpdatedEvent } from 'src/events/user-balance-updated.event';
import { InsufficientEvent } from 'src/events/user.insufficient.event';

//api
@Controller('orders')
export class OrderController {
  constructor(private readonly service: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.service.create(dto);
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

  @EventPattern('balance.updated')
  async handleUserbalanceUpdated(@Payload() payload: UserBalanceUpdatedEvent) {
    await this.orderService.markPaid(payload.orderId);
  }

  @EventPattern('balance.insufficient')
  async handleUserbalanceNotEnough(@Payload() payload: InsufficientEvent) {
    await this.orderService.markFailed(payload.orderId);
  }
}
