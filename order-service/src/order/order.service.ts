import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';
import { OrderStatus } from 'src/orders/enums/order.enums';
import { CreateOrderDto } from './dto/create-order.dto';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { OrderCreatedEvent } from 'src/events/order-created.event';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<void> {
    const {
      userId,
      type,
      productId,
      amount,
      price,
    } = createOrderDto;

    const finalSum = amount * price;
    const order = this.ordersRepo.create({
      userId,
      type,
      productId,
      amount,
      price,
      discount: 0,
      finalSum,
      status: OrderStatus.PENDING,
    });

    await this.ordersRepo.save(order);

    // уведомляем OrderService
    const event:OrderCreatedEvent = {
      eventId: uuidv4(),
      orderId: order.id,
      userId: order.userId,
      type: order.type,
      amount: order.amount,
      price: order.price,
      finalSum: order.finalSum,
      timestamp: new Date().toISOString()
    };

    //отправляем событие в Kafka
    console.log(`стараюсь отравить event - ${event.eventId} c ${event.orderId}`)
    this.kafkaProducer.emitOrderCreated(event).catch((err) => {
    console.error('Kafka emit error (orders.created):', err);
    });
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
