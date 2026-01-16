import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth/auth.controller';
import { AuthClient } from './auth/auth.service';
import { JwtGuard } from './guards/jwt.guard';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthClient, JwtGuard],
})
export class ApiGatewayModule {}

