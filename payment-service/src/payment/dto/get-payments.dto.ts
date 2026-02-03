import { IsNotEmpty, IsOptional, IsPositive, IsUUID } from "class-validator";
import { PaymentStatus } from "src/payments/enums/payment.enums";

export class GetPaymentsDto {
  @IsNotEmpty()
  status: PaymentStatus;
}