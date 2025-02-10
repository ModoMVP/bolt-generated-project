import { 
  IsEmail, 
  IsNotEmpty, 
  IsEnum, 
  IsOptional, 
  MinLength 
} from 'class-validator';
import { UserRole } from '../../auth/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole = UserRole.USER;

  @IsOptional()
  tenantId?: string;
}
