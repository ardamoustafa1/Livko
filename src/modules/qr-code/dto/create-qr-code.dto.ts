import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateQrCodeDto {
  @ApiProperty({ description: 'Unique QR code identifier (e.g. content of QR)' })
  @IsString()
  @MaxLength(128)
  code: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  roomId?: string | null;

  @ApiPropertyOptional({ description: 'Neo4j graph node ID' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  graphNodeId?: string | null;

  @ApiPropertyOptional({ description: 'Node type: Room, Elevator, Stair, Exit' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  nodeType?: string | null;
}
