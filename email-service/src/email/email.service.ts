import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  sendWelcomeEmail(email:string): void {
    console.log(`${email} is send`);
  }
}
