import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsObject, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateAccessibilityRuleDto {
  @ApiProperty()
  @IsUUID()
  institutionId: string;

  @ApiProperty({ example: 'disabled', description: 'disabled, elderly, stroller, none' })
  @IsString()
  @MaxLength(32)
  mode: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  excludeStairs?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  preferElevators?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  preferWideCorridors?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown> | null;
}
