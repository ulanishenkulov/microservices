import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { ProcessedEvent } from './processed-event.entity';
import { BalanceReservation } from './balance-reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,ProcessedEvent, BalanceReservation])],
  exports: [TypeOrmModule], // экспортируем репозиторий для UserModule
})
export class UsersModule {}
