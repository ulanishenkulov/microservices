import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({ example: 'user with 550e8400-e29b-41d4-a716-446655440000 is deleted' })
  message: string;
}