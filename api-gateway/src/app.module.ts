import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/auth.controller';
import { AuthClient } from './auth/auth.service';
import { JwtGuard } from './guards/jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './order/order.controller';
import { OrderClient } from './order/order.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentClient } from './payment/payment.service';
import { StripeWebhookController } from './webhooks/stripe-webhook.controller';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AuthController,OrderController,PaymentController,StripeWebhookController],
  providers: [AuthClient, OrderClient, JwtGuard,PaymentClient],
})
export class ApiGatewayModule {}

