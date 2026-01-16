import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthClient } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClient) {}

  @Post('register')
  async register(@Body() dto: any) {
    try {
      return await this.authClient.register(dto);
    } catch (err: any) {
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() dto: any) {
    try {
      return await this.authClient.login(dto);
    } catch (err: any) {
      if (err.response?.data) {
        throw new HttpException(err.response.data, err.response.status);
      }
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}


