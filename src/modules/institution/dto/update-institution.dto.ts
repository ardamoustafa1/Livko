import { PartialType } from '@nestjs/swagger';
import { CreateInstitutionDto } from './create-institution.dto';
import { IsObject, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateInstitutionDto extends PartialType(CreateInstitutionDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown> | null;
}
