import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthClient } from '../auth/auth.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly authClient: AuthClient) {}

  async canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return false;

    try {
      const user = await this.authClient.validate(token);
      req.user = user; // прикручиваем пользователя к запросу
      return true;
    } catch {
      return false;
    }
  }
}
