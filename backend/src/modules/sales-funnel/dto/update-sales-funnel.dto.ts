import { 
  IsOptional, 
  IsObject, 
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';

class UpdateSalesFunnelStageDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  color?: string;

  @IsOptional()
  order?: number;
}

export class UpdateSalesFunnelDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsObject()
  configuration?: Record<string, any>;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSalesFunnelStageDto)
  stages?: UpdateSalesFunnelStageDto[];

  @IsOptional()
  isActive?: boolean;
}
