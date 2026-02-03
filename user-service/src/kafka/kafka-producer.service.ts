import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserBalanceReservedEvent } from 'src/events/user-balance-reserved.event';
import { BalanceUpdatedEvent } from 'src/events/user-balance-updated.event';
import { InsufficientEvent } from 'src/events/user.insufficient.event';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject(process.env.KAFKA_CLIENT_NAME || 'KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async emitUserBalanceUpdated(payload: BalanceUpdatedEvent) {
    return this.kafka.emit('balance.updated', payload);
  }

  async emitBalanceInsufficientEvent(payload: InsufficientEvent) {
    return this.kafka.emit('balance.insufficient', payload);
  }

  async emitUserBalanceReserved(payload: UserBalanceReservedEvent) {
    return this.kafka.emit('balance.reserved', payload);
  }
}
