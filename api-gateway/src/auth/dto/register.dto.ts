import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsString,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'src/enums/user-role.enum';

export class RegisterDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'password123',
    minLength: 3,
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.USER,
    description: 'User role',
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
