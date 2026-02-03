import { IsNotEmpty, IsOptional, IsPositive, IsUUID } from "class-validator";

export class CreatePaymentDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  orderId: string;

  @IsOptional()
  @IsPositive()
  amount: number;
}
