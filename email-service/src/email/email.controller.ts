import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailService } from './email.service';
import { UsersRegisteredEvent } from 'src/events/users-registered.event';

@Controller()
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @EventPattern('users.registered')
  async handleUserCreated(@Payload() payload: UsersRegisteredEvent) {
    this.emailService.sendWelcomeEmail(payload.email);
  }
}
