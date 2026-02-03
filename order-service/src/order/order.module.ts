import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { OrderService } from './order.service';
import { OrderController, OrderKafkaController } from './order.controller';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    OrdersModule,
    KafkaModule,
  ],
  controllers: [OrderController,OrderKafkaController],
  providers: [OrderService],
})
export class OrderModule {}
