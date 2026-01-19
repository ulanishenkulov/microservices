import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import axios from 'axios';

@Injectable()
export class AuthClient {
  private readonly authUrl: string;
  constructor(private readonly http: HttpService,
              private readonly configService: ConfigService,
) {
    this.authUrl = this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
  }

  async register(dto: RegisterDto) {
    const res = await axios.post(`${this.authUrl}/register`, dto);
    return res.data;
  }

  async login(dto: LoginDto) {
    const res = await axios.post(`${this.authUrl}/login`, dto);
    return res.data;
  }

  async validate(token: string) {
    const res = await axios.post(`${this.authUrl}/validate`, { token });
    return res.data;
  }
}
