import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payment.module';
import { PaymentService } from './payment.service';
import { PaymentController, PaymentKafkaController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { OrderClient } from './clients/order.client';
import { StripeMockService } from './stripe/stripe.mock.service';
import { PaymentInternalController } from './internal-payment.controller';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  imports: [
    PaymentsModule,
    KafkaModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [PaymentController,PaymentInternalController,PaymentKafkaController],
  providers: [PaymentService, OrderClient, StripeMockService],
})
export class PaymentModule {}
