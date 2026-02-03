import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity('processed_events')
export class ProcessedEvent {
  @PrimaryColumn()
  eventId: string;

  @Column()
  eventType: string;

  @CreateDateColumn()
  processedAt: Date;
}