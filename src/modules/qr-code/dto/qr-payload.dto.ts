import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class QrPayloadDto {
  @ApiProperty({ description: 'QR code (e.g. room number ZK-001)' })
  code: string;

  @ApiProperty({ description: 'URL to encode in the physical QR label' })
  suggestedUrl: string;

  @ApiProperty({ description: 'Same as suggestedUrl; use this as QR content when printing' })
  qrContent: string;

  @ApiPropertyOptional({ description: 'Graph node ID for navigation' })
  nodeId?: string;

  @ApiPropertyOptional({ description: 'Room or Exit name' })
  label?: string;
}
