import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order])],
  exports: [TypeOrmModule], // экспортируем репозиторий для OrderModule
})
export class OrdersModule {}
