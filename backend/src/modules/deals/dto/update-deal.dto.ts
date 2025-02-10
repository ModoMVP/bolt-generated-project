import { 
  IsOptional, 
  IsNumber, 
  IsDate, 
  IsEnum, 
  IsObject,
  IsUUID 
} from 'class-validator';
import { Type } from 'class-transformer';
import { DealPriority } from '../entities/deal.entity';

export class UpdateDealDto {
  @IsOptional()
  title?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  value?: number;

  @IsOptional()
  @IsEnum(DealPriority)
  priority?: DealPriority;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expectedClosingDate?: Date;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsObject()
  additionalInfo?: Record<string, any>;

  @IsOptional()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  clientId?: string;

  @IsOptional()
  @IsUUID()
  stageId?: string;

  @IsOptional()
  @IsUUID()
  responsibleId?: string;
}
