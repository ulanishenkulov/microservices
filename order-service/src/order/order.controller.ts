import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';

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
