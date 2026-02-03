import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController,UserKafkaController } from './user.controller';
import { UsersModule } from 'src/users/users.module';
import { KafkaModule } from 'src/kafka/kafka.module';

@Module({
  controllers: [UsersController,UserKafkaController],
  providers: [UsersService],
  imports: [UsersModule,KafkaModule]
})
export class UserModule {}
