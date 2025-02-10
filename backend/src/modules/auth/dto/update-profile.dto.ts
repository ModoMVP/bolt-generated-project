import { IsOptional, IsPhoneNumber, IsObject } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsObject()
  preferences?: Record<string, any>;
}
