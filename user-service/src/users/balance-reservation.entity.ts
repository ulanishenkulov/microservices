import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";
import { BalanceStatus } from "./enums/balance-reservation.enums";

@Entity('balance_reservations')
export class BalanceReservation {
  @PrimaryColumn()
  orderId: string;

  @Column()
  userId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: BalanceStatus,
  })
  status: BalanceStatus;

  @CreateDateColumn()
  createdAt: Date;
}
