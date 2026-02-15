// dto/order.response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus, OrderType } from '../enums/order.enums';

export class OrderResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ format: 'uuid' })
  userId: string;

  @ApiProperty({ enum: OrderType })
  type: OrderType;

  @ApiProperty({ enum: OrderStatus })
  status: OrderStatus;

  @ApiProperty({ example: 2 })
  amount: number;

  @ApiProperty({ example: 49.99 })
  price: number;

  @ApiProperty()
  createdAt: string;
}
