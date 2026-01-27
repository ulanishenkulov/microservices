import { IsEmail, IsNotEmpty, MinLength,IsString, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/enums/user-role.enum';

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?:UserRole
}
