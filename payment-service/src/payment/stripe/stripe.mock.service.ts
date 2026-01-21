import { Injectable } from "@nestjs/common";

@Injectable()
export class StripeMockService {
  async createCheckoutSession(paymentId: string): Promise<string> {
    return `${process.env.Stripe_SERVICE_URL}/${paymentId}`;
  }
}
