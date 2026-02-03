import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';
import { OrderType } from '../../orders/enums/order.enums';

export class CreateOrderDto {
  @IsUUID()
  @IsNotEmpty()
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

