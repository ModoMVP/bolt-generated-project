import { 
  IsNotEmpty, 
  IsEmail, 
  IsOptional, 
  IsEnum, 
  IsObject 
} from 'class-validator';
import { ClientType } from '../entities/client.entity';

export class CreateClientDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phone?: string;

  @IsEnum(ClientType)
  @IsOptional()
  type?: ClientType = ClientType.PESSOA_FISICA;

  @IsOptional()
  document?: string;

  @IsOptional()
  @IsObject()
  additionalInfo?: Record<string, any>;
}
