import { Module } from '@nestjs/common';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot({
      isGlobal:true
    }),  
  ]
})
export class AppModule {}
