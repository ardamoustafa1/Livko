import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { AccessibilityMode } from '../../../shared/enums/accessibility-mode.enum';

export class ComputeRouteDto {
  @ApiProperty({ description: 'Start graph node ID (or QR code value)' })
  @IsString()
  startNodeId: string;

  @ApiProperty({ description: 'Target graph node ID (or room ID)' })
  @IsString()
  targetNodeId: string;

  @ApiPropertyOptional({ enum: AccessibilityMode, default: AccessibilityMode.NONE })
  @IsOptional()
  @IsEnum(AccessibilityMode)
  accessibilityMode?: AccessibilityMode;

  @ApiPropertyOptional({ description: 'When true, route to nearest exit only' })
  @IsOptional()
  @IsBoolean()
  emergencyMode?: boolean;

  @ApiPropertyOptional({ description: 'Institution ID for cache/emergency scope' })
  @IsOptional()
  @IsString()
  institutionId?: string;
}
