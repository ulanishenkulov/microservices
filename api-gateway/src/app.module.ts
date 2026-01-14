import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, OrderModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
