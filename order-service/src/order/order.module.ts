import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';

@Module({
  imports: [
    OrdersModule,
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
