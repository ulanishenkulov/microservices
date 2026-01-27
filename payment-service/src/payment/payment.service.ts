import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/payments/payment.entity';
import { Repository } from 'typeorm';
import { OrderClient } from './clients/order.client';
import { StripeMockService } from './stripe/stripe.mock.service';
import { ProcessedStripeEvent } from 'src/payments/processed-stripe-event.entity';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { PaymentsCompletedEvent } from 'src/events/payments-completed.event';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(ProcessedStripeEvent)
    private readonly processedStripeEventRepo: Repository<ProcessedStripeEvent>,
    private readonly orderClient: OrderClient,
    private readonly stripeMock: StripeMockService,
    private readonly kafkaProducer: KafkaProducerService,
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
      console.warn(`Payment ${paymentId} not found`);
      return;
    }

    payment.status = 'PAID';
    await this.paymentRepo.save(payment);

    // уведомляем OrderService
    const event:PaymentsCompletedEvent = {
      orderId: payment.orderId,
    };

    //отправляем событие в Kafka
    console.log(`стараюсь отравить event в order-service ${event.orderId}`)
    this.kafkaProducer.emitPaymentCompleted(event).catch((err) => {
    console.error('Kafka emit error (payments.completed):', err);
    });

    await this.orderClient.markPaid(payment.orderId);

    return payment;
  }
}

