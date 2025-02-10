import { 
  IsNotEmpty, 
  IsOptional, 
  IsObject, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

class SalesFunnelStageDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  color?: string;

  @IsOptional()
  order?: number;
}

export class CreateSalesFunnelDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => SalesFunnelStageDto)
  stages?: SalesFunnelStageDto[];
}
