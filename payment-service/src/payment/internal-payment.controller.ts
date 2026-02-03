import { Body, Controller, ForbiddenException, Headers, Param, Patch } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { ConfigService } from "@nestjs/config";
import { MarkPaidDto } from "./dto/mark-paid-payment.dto";
import { markPaidTypeForService } from "./types/mark-paid-payment.type";

@Controller('internal/payments')
export class PaymentInternalController {
  constructor(
    private readonly service: PaymentService,
    private readonly configService: ConfigService,
) {}

  @Patch(':id/paid')
  markPaid(
    @Param('id') id: string,
    @Headers('x-api-key') apiKey: string,
    @Body() markPaidDtoDto: MarkPaidDto
) {
     if (apiKey !== this.configService.getOrThrow<string>('API_GATEWAY_SECRET')) {
      throw new ForbiddenException('Forbidden');
    }
    const payload: markPaidTypeForService = {
      id,
      type: markPaidDtoDto.type
    }
    return this.service.markPaid(payload);
  }
};
