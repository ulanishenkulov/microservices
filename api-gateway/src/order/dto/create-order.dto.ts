import {
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderType } from '../enums/order.enums';

export class CreateOrderDto {
  @ApiProperty({
    enum: OrderType,
    example: OrderType.PRODUCT,
  })
  @IsEnum(OrderType)
  type: OrderType;

  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 49.99 })
  @IsPositive()
  price: number;
}


