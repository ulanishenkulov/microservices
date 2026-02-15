import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from 'src/enums/user-role.enum';

export class UserResponseDto {
  @ApiProperty({ format: 'uuid', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role: UserRole;

  @ApiProperty({ example: 0 })
  balance: number;

  @ApiProperty({ example: '2026-02-11T12:00:00.000Z' })
  createdAt: string;
}
