import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from 'src/payments/payment.entity';
import { DataSource, Repository } from 'typeorm';
import { OrderClient } from './clients/order.client';
import { StripeMockService } from './stripe/stripe.mock.service';
import { v4 as uuidv4 } from 'uuid';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { PaymentsCompletedEvent } from 'src/events/payments-completed.event';
import { PaymentStatus } from 'src/payments/enums/payment.enums';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { markPaidTypeForService } from './types/mark-paid-payment.type';
import { UserBalanceReservedEvent } from 'src/events/user-balance-reserved.event';
import { ProcessedEvent } from 'src/payments/processed-event.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(ProcessedEvent)
    private readonly processedEventRepo: Repository<ProcessedEvent>,
    private readonly orderClient: OrderClient,
    private readonly stripeMock: StripeMockService,
    private readonly kafkaProducer: KafkaProducerService,
    private readonly dataSource: DataSource,
  ) {}

  async createPaymentOrderEvent(orderCreatedEvent: OrderCreatedEvent) {
    const {
      orderId,
      userId,
      price,
      type,
      eventId,
    } = orderCreatedEvent;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ идемпотентность
      const existing = await queryRunner.manager.findOne(ProcessedEvent, {
        where: { eventId },
        lock: { mode: 'pessimistic_write' },
      });

      if (existing) {
        await queryRunner.rollbackTransaction();
        return;
      }

      // 2️⃣ создаём payment
      const payment = queryRunner.manager.create(Payment, {
        orderId,
        userId,
        amount: price,
        status: PaymentStatus.PENDING,
        type,
      });

      const savedPayment = await queryRunner.manager.save(payment);

      // 3️⃣ сохраняем processed_event
      const processedEvent = queryRunner.manager.create(ProcessedEvent, {
        eventId,
        eventType: type,
        processedAt: new Date(),
      });

      await queryRunner.manager.save(processedEvent);

      // 4️⃣ коммит
      await queryRunner.commitTransaction();

      // 5️⃣ ВНЕ транзакции: Stripe
      const paymentUrl = await this.stripeMock.createCheckoutSession(
        savedPayment.id,
      );

      await this.paymentRepo.update(savedPayment.id, {
        paymentUrl,
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async createPaymentUserbalanceReservedEvent(userBalanceReservedEvent: UserBalanceReservedEvent) {
    const { orderId, userId, amount, type } = userBalanceReservedEvent;

    const payment = this.paymentRepo.create({
      orderId,
      userId, 
      amount,
      status: PaymentStatus.PENDING,
      type
    });

    const savedPayment = await this.paymentRepo.save(payment);

    //создаём Stripe Checkout (mock)
    const paymentUrl = await this.stripeMock.createCheckoutSession(
      savedPayment.id,
    );

    savedPayment.paymentUrl = paymentUrl;
    await this.paymentRepo.save(savedPayment);
  }

  async getAll(query:GetPaymentsDto) {
    return this.paymentRepo.find({where: query});
  }

  async markPaid(payload: markPaidTypeForService) {
    const { type, id } = payload
    const payment = await this.paymentRepo.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException('payment not found');
    }

    payment.status = PaymentStatus.PAID;
    await this.paymentRepo.save(payment);

    // уведомляем OrderService
    const event:PaymentsCompletedEvent = {
      eventId: uuidv4(),
      userId: payment.userId,
      paymentId: payment.id,
      amount: payment.amount,
      type,
      timestamp: new Date().toISOString(),
      orderId: payment.orderId
    };

    //отправляем событие в Kafka
    console.log(`стараюсь отравить event - ${event.eventId} на topic payments.completed payment - ${event.paymentId}`)
    this.kafkaProducer.emitPaymentCompleted(event).catch((err) => {
    console.error('Kafka emit error (payments.completed):', err);
    });

    return payment;
  }
}

