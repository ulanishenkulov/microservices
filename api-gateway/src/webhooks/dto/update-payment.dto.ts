import { IsNotEmpty, IsUUID } from "class-validator";
import { PaymentType } from "src/enums/payment.enums";

export class UpdatePaymentDto {
@IsNotEmpty()
  @IsUUID()
  paymentId: string;

  @IsNotEmpty()
  type: PaymentType;
}