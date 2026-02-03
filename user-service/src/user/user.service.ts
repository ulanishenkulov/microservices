import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { PaymentsCompletedEvent } from 'src/events/payments-completed.event';
import { KafkaProducerService } from 'src/kafka/kafka-producer.service';
import { BalanceUpdatedEvent } from 'src/events/user-balance-updated.event';
import { OrderCreatedEvent } from 'src/events/order-created.event';
import { BalanceReservation } from 'src/users/balance-reservation.entity';
import { InsufficientEvent } from '../events/user.insufficient.event';
import { UserBalanceReservedEvent } from '../events/user-balance-reserved.event';
import { BalanceStatus } from 'src/users/enums/balance-reservation.enums';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(BalanceReservation) private readonly balanceRepo: Repository<BalanceReservation>,
    private readonly kafkaProducer: KafkaProducerService,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepo.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async topUpUser(payload: PaymentsCompletedEvent) {
    const { userId, amount } = payload;
    const user = await this.userRepo.findOne({where: {id:userId}});
    if (!user) {
      console.warn('User not found');
    }
    const currentBalance = Number(user.balance ?? 0);
    user.balance = currentBalance + Number(amount);
    const updatedUser = await this.userRepo.save(user);

    const event: BalanceUpdatedEvent = {
      eventId: uuidv4(),
      userId: user.id,
      orderId:  payload.orderId,
      previousBalance: user.balance,
      newBalance: updatedUser.balance,
      timestamp: new Date().toISOString()
    }
    //отправляем событие в Kafka
    console.log(`стараюсь отравить event - ${event.eventId} c order-${event.orderId}`);
    this.kafkaProducer.emitUserBalanceUpdated(event).catch((err) => {
    console.error('Kafka emit error (balance.updated):', err);
    });
  }

  async decreaseUserBalance(payload: PaymentsCompletedEvent) {
    const { userId, orderId, amount } = payload;

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1️⃣ Лочим пользователя
      const user = await queryRunner.manager.findOne(User, {
        where: { id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!user) {
        throw new Error(`User ${userId} not found`);
      }

      // 2️⃣ Лочим резерв
      const reservation = await queryRunner.manager.findOne(
        BalanceReservation,
        {
          where: {
            orderId,
            userId,
            status: BalanceStatus.RESERVED,
          },
          lock: { mode: 'pessimistic_write' },
        },
      );

      if (!reservation) {
        console.warn(
          `No RESERVED reservation for order ${orderId}`,
        );
        await queryRunner.rollbackTransaction();
        return;
      }

      // 3️⃣ Контроль
      if (Number(reservation.amount) !== Number(amount)) {
        throw new Error(
          `Reservation amount mismatch for order ${orderId}`,
        );
      }

      // 4️⃣ Списываем баланс
      user.balance = Number(user.balance) - Number(amount);
      await queryRunner.manager.save(user);

      // 5️⃣ Подтверждаем резерв
      reservation.status = BalanceStatus.COMMITED;
      await queryRunner.manager.save(reservation);

      // 6️⃣ Коммит
      await queryRunner.commitTransaction();

      // 7️⃣ Kafka ПОСЛЕ commit
      const event: BalanceUpdatedEvent = {
        eventId: uuidv4(),
        userId,
        orderId,
        previousBalance: Number(user.balance) + Number(amount),
        newBalance: user.balance,
        timestamp: new Date().toISOString()
      }

      await this.kafkaProducer.emitUserBalanceUpdated(event);
      console.log(
        `Withdraw committed: user=${userId}, order=${orderId}`,
      );
    } catch (err) {
     await queryRunner.rollbackTransaction();
      console.error(
        `Withdraw transaction failed for order ${orderId}`,
        err,
      );
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async reserveUserBalance(payload: OrderCreatedEvent) {
    const { userId, orderId, finalSum, eventId, type } = payload;

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      console.warn(`User ${userId} not found`);
      return;
    }

    // 1️⃣ Idempotency — этот order уже обрабатывался?
    const existingReservation = await this.balanceRepo.findOne({
      where: { orderId, userId },
    });

    if (existingReservation) {
      console.log(`Reservation already exists for order ${orderId}`);
      return;
    }

    // 2️⃣ Считаем сумму ВСЕХ резервов пользователя
    const { sum } = await this.balanceRepo
      .createQueryBuilder('b')
      .select('COALESCE(SUM(b.amount), 0)', 'sum')
      .where('b.userId = :userId', { userId })
      .andWhere('b.status = :status', {
        status: BalanceStatus.RESERVED,
      })
      .getRawOne();

    const reservedTotal = Number(sum);

    // 3️⃣ Реально доступный баланс
    const availableBalance =
     Number(user.balance) - reservedTotal;

    // 4️⃣ Денег не хватает
    if (availableBalance < finalSum) {
      const insufficientEvent: InsufficientEvent = {
        eventId,
        orderId,
        userId,
        requiredAmount: finalSum - availableBalance,
        currentBalance: availableBalance,
        timestamp: new Date().toISOString(),
      };

      console.log(
        `Недостаточно средств для user ${userId}, order ${orderId}`,
      );

      await this.kafkaProducer.emitBalanceInsufficientEvent(
        insufficientEvent,
      );

      return;
    }

      // 5️⃣ Денег хватает → резервируем
      const reservation = this.balanceRepo.create({
        orderId,
        userId,
        amount: finalSum,
        status: BalanceStatus.RESERVED,
      });

    await this.balanceRepo.save(reservation);

    const balanceReservedEvent: UserBalanceReservedEvent = {
      eventId,
      orderId,
      userId,
      amount: finalSum,
      timestamp: new Date().toISOString(),
      type
    };

    console.log(
      `Баланс зарезервирован: user ${userId}, order ${orderId}`,
    );

    await this.kafkaProducer.emitUserBalanceReserved(
      balanceReservedEvent,
    );
  }
}
