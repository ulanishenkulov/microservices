import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment])],
  exports: [TypeOrmModule], // экспортируем репозиторий для PaymentModule
})
export class PaymentsModule {}
