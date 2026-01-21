import { Body, Controller, HttpException, HttpStatus, Post } from "@nestjs/common";
import { PaymentClient } from '../payment/payment.service';
import { UpdatePaymentDto } from "./dto/update-payment.dto";

@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(
    private readonly paymentClient: PaymentClient,
  ) {}

  @Post()
  async handle(@Body() body: UpdatePaymentDto) {
    try {
         await this.paymentClient.markPaid(body.paymentId);
         return { received: true };
        } catch (err: any) {
          if (err.response?.data) {
            throw new HttpException(err.response.data, err.response.status);
          }
        throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
  }
}
