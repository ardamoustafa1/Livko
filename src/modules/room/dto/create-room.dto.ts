import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @ApiProperty()
  @IsUUID()
  floorId: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(64)
  functionType?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(32)
  roomNumber?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  xPosition?: number | null;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  yPosition?: number | null;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isAccessible?: boolean;

  @ApiPropertyOptional({ description: 'Area in square meters' })
  @IsOptional()
  @Type(() => Number)
  areaSqm?: number | null;
}
