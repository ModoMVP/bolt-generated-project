import { 
  IsOptional, 
  IsEmail, 
  IsEnum, 
  IsObject 
} from 'class-validator';
import { ClientType } from '../entities/client.entity';

export class UpdateClientDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  @IsEnum(ClientType)
  type?: ClientType;

  @IsOptional()
  document?: string;

  @IsOptional()
  @IsObject()
  additionalInfo?: Record<string, any>;

  @IsOptional()
  isActive?: boolean;
}
