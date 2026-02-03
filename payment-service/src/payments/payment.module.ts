import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { ProcessedEvent } from './processed-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payment,ProcessedEvent])],
  exports: [TypeOrmModule], // экспортируем репозиторий для PaymentModule
})
export class PaymentsModule {}
