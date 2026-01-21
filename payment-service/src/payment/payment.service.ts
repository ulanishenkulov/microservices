import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/payments/payment.entity';
import { Repository } from 'typeorm';
import { OrderClient } from './clients/order.client';
import { StripeMockService } from './stripe/stripe.mock.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment) 
    private readonly paymentRepo: Repository<Payment>,
    private readonly orderClient: OrderClient,
    private readonly stripeMock: StripeMockService,
  ) {}

  async create(orderId: string) {
    const order = await this.orderClient.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    //создаём payment (amount берём из order)
    const payment = this.paymentRepo.create({
      orderId,
      amount: order.total,
      status: 'PENDING',
    });

    const savedPayment = await this.paymentRepo.save(payment);

    //создаём Stripe Checkout (mock)
    const paymentUrl = await this.stripeMock.createCheckoutSession(
      savedPayment.id,
    );

    //отдаём фронту URL
    return {
      paymentId: savedPayment.id,
      paymentUrl,
    };
  }

  async markPaid(paymentId: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id: paymentId },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    payment.status = 'PAID';
    await this.paymentRepo.save(payment);

    // уведомляем OrderService
    await this.orderClient.markPaid(payment.orderId);

    return payment;
  }
}

