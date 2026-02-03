import { IsNotEmpty } from "class-validator";
import { PaymentType } from "src/payments/enums/payment.enums";

export class MarkPaidDto {
  @IsNotEmpty()
  type: PaymentType;
}