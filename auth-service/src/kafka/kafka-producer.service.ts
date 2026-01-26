import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { UserRegisteredEvent } from 'src/events/user-registered.event';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  constructor(@Inject(process.env.KAFKA_CLIENT_NAME || 'KAFKA_CLIENT') private readonly kafka: ClientKafka) {}

  async onModuleInit() {
    await this.kafka.connect();
  }

  async emitUserCreated(payload: UserRegisteredEvent) {
    return this.kafka.emit('users.registered', payload);
  }
}
