import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('processed_stripe_events')
export class ProcessedStripeEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ name: 'stripe_event_id', type: 'varchar' })
  stripeEventId: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ name: 'payment_id', type: 'uuid', nullable: true })
  paymentId?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
