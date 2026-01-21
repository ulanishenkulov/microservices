import { Controller, ForbiddenException, Headers, Param, Patch } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ConfigService } from "@nestjs/config";

@Controller('internal/payments')
export class PaymentInternalController {
  constructor(
    private readonly service: PaymentService,
    private readonly configService: ConfigService,
) {}

  @Patch(':id/paid')
  markPaid(
    @Param('id') id: string,
    @Headers('x-api-key') apiKey: string
) {
     if (apiKey !== this.configService.getOrThrow<string>('API_GATEWAY_SECRET')) {
      throw new ForbiddenException('Forbidden');
    }
    return this.service.markPaid(id);
  }
};
