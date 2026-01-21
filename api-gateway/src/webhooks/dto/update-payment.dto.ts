import { IsNotEmpty, IsUUID } from "class-validator";

export class UpdatePaymentDto {
@IsNotEmpty()
  @IsUUID()
  paymentId: string;
}