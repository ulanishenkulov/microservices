import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../orders/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepo: Repository<Order>,
  ) {}

  async create(userId: string) {
    const total = this.generateRandomTotal();
    const order = this.ordersRepo.create({ userId, total });
    return this.ordersRepo.save(order);
  }

  async markPaid(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    order.status = 'PAID';
    return this.ordersRepo.save(order);
  }


  async findById(id: string) {
    const order = await this.ordersRepo.findOne({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');

    return order;
  }

  private generateRandomTotal(): number {
  return Math.floor(Math.random() * (1000 - 50 + 1)) + 50;  // просто сгенерировал total так, как будто мы считаем в backend на основании продуктов и его количества
}
}
