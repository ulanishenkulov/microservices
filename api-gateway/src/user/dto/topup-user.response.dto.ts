import { ApiProperty } from '@nestjs/swagger';

export class TopUpUserResponseDto {
  @ApiProperty({ example: 150, description: 'New user balance after top up' })
  newBalance: number;
}
