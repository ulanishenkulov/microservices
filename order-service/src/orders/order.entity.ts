import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column('numeric')
  total: number;

  @Column({ default: 'NEW' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}

