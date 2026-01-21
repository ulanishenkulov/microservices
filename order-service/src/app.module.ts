import { Module } from '@nestjs/common';
import { OrderModule } from './order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeormConfig } from './config/typeOrm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),  
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getTypeormConfig,
      inject: [ConfigService]
  }),
  OrderModule
],
})
export class AppModule {}
