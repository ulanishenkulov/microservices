import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { ProcessedEvent } from './processed-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order,ProcessedEvent])],
  exports: [TypeOrmModule], // экспортируем репозиторий для OrderModule
})
export class OrdersModule {}
