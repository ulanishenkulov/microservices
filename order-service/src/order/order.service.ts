import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { OrderStatus } from 'src/orders/enums/order.enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { ProcessedEvent } from 'src/orders/processed-event.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    @InjectRepository(ProcessedEvent) private readonly precessEventRepo: Repository<ProcessedEvent>,
    private readonly kafkaProducer: KafkaProducerService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    key: string,
  ): Promise<Order | ProcessedEvent> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ проверка идемпотентности (FOR UPDATE!)
      const existing = await queryRunner.manager.findOne(ProcessedEvent, {
        where: { eventId: key },
        lock: { mode: 'pessimistic_write' },
      });

      if (existing) {
        await queryRunner.rollbackTransaction();
        return existing;
      }

      const {
        userId,
        type,
        productId,
        amount,
        price,
      } = createOrderDto;

      const finalSum = amount * price;

      // 2️⃣ создаём order
      const order = queryRunner.manager.create(Order, {
        userId,
        type,
        productId,
        amount,
        price,
        discount: 0,
        finalSum,
        status: OrderStatus.PENDING,
      });

      await queryRunner.manager.save(order);

      // 3️⃣ сохраняем processed_event
      const processedEvent = queryRunner.manager.create(ProcessedEvent, {
        eventId: key,
        eventType: type,
        processedAt: new Date(),
      });

      await queryRunner.manager.save(processedEvent);

      // 4️⃣ коммит
      await queryRunner.commitTransaction();

      // 5️⃣ Kafka ПОСЛЕ commit
      const event: OrderCreatedEvent = {
        eventId: uuidv4(), // ⚠️ новый eventId
        orderId: order.id,
        userId: order.userId,
        type: order.type,
        amount: order.amount,
        price: order.price,
        finalSum: order.finalSum,
        timestamp: new Date().toISOString(),
      };

      this.kafkaProducer.emitOrderCreated(event).catch((err) => {
        console.error('Kafka emit error (orders.created):', err);
      });

      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async markPaid(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) {
      console.warn(`Order ${id} not found`);
      return;
    }
    order.status = OrderStatus.COMPLETED;
    await this.ordersRepo.save(order);
    console.log(`Order ${id} marked as PAID`);
  }

  async markFailed(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) {
      console.warn(`Order ${id} not found`);
      return;
    }
    order.status = OrderStatus.FAILED;
    await this.ordersRepo.save(order);
    console.log(`Order ${id} marked as FAILED`);
  }

  async findById(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return order;
  }
}
