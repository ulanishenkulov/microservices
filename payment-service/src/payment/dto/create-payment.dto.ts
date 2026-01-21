import { IsNotEmpty, IsUUID } from "class-validator";

export class CreatePaymentDto {
@IsNotEmpty()
  @IsUUID()
  orderId: string;
}