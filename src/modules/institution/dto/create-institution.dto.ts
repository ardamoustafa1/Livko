import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateInstitutionDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Unique slug for URLs, e.g. hospital-istanbul' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  @Matches(/^[a-z0-9-]+$/, { message: 'slug must be lowercase alphanumeric and hyphens only' })
  slug: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  settings?: Record<string, unknown> | null;
}
