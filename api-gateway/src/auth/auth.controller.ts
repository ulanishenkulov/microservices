import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthClient } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthTokenResponseDto } from './dto/auth-token.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authClient: AuthClient) {}

  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    type: AuthTokenResponseDto,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
  })
  async register(@Body() dto: RegisterDto) {
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
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    type: AuthTokenResponseDto,
    description: 'User successfully logged in',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async login(@Body() dto: LoginDto) {
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
