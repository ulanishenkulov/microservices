import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthClient {
  private readonly authUrl: string;
  constructor(private readonly http: HttpService,
              private readonly configService: ConfigService,
) {
    this.authUrl = this.configService.getOrThrow<string>('AUTH_SERVICE_URL');
  }

  async register(dto: RegisterDto) {
    const response$ = this.http.post(`${this.authUrl}/register`, dto);
    return firstValueFrom(response$).then(res => res.data);
  }

  async login(dto: LoginDto) {
    const response$ = this.http.post(`${this.authUrl}/login`, dto);
    return firstValueFrom(response$).then(res => res.data);
  }

  async validate(token: string) {
    const response$ = this.http.post(`${this.authUrl}/validate`, { token });
    return firstValueFrom(response$).then(res => res.data);
  }
}
