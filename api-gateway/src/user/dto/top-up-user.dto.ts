import { IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TopUpUserDto {
  @ApiProperty({ description: 'User ID', format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'Amount to top up', example: 100, minimum: 1 })
  @IsInt()
  @Min(1)
  amount: number;
}
