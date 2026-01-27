import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { ProcessedStripeEvent } from './processed-stripe-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment,ProcessedStripeEvent])],
  exports: [TypeOrmModule], // экспортируем репозиторий для PaymentModule
})
export class PaymentsModule {}
