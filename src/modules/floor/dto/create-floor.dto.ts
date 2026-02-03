import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateFloorDto {
  @ApiProperty()
  @IsInt()
  @Min(-10)
  @Max(500)
  level: number;

  @ApiProperty()
  @IsUUID()
  buildingId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  floorPlanUrl?: string | null;
}
