import { IsEnum, IsInt, IsOptional, IsPositive, IsUUID, Min,IsNotEmpty } from "class-validator";
import { OrderType } from "../enums/order.enums";

export class CreateOrderPayloadDto {
  @IsUUID()
  userId: string;

  @IsEnum(OrderType)
  type: OrderType;

  @IsOptional()
  @IsUUID()
  productId?: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsPositive()
  price: number;
}
