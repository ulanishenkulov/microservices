import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/auth.controller';
import { AuthClient } from './auth/auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { ConfigModule } from '@nestjs/config';
import { OrderController } from './order/order.controller';
import { OrderClient } from './order/order.service';
import { PaymentController } from './payment/payment.controller';
import { PaymentClient } from './payment/payment.service';
import { StripeWebhookController } from './webhooks/stripe-webhook.controller';
import { KafkaModule } from './kafka/kafka.module';
import { RolesGuard } from './guards/roles.guard';
import { UserClient } from './user/user.service';
import { UserController } from './user/user.controller';

@Module({
  imports: [
    KafkaModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true
    }),
  ],
  controllers: [AuthController,OrderController,PaymentController,StripeWebhookController, UserController],
  providers: [AuthClient, OrderClient,UserClient, JwtAuthGuard,PaymentClient, RolesGuard],
})
export class ApiGatewayModule {}

