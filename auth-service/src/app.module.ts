import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
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
  AuthModule
],
})
export class AppModule {}
