import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthClient {
  constructor(private readonly http: HttpService) {}

  async register(dto: any) {
    const response$ = this.http.post('http://localhost:3001/auth/register', dto);
    return firstValueFrom(response$).then(res => res.data);
  }

  async login(dto: any) {
    const response$ = this.http.post('http://localhost:3001/auth/login', dto);
    return firstValueFrom(response$).then(res => res.data);
  }

  async validate(token: string) {
    const response$ = this.http.post('http://localhost:3001/auth/validate', { token });
    return firstValueFrom(response$).then(res => res.data);
  }
}


