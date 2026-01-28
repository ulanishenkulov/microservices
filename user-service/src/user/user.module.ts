import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [UsersModule]
})
export class UserModule {}
