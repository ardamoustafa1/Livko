import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResolveQrResponseDto {
  @ApiProperty({ description: 'Graph node ID for route computation' })
  nodeId: string;

  @ApiPropertyOptional({ description: 'Room, Elevator, Stair, Exit' })
  nodeType?: string;

  @ApiPropertyOptional({ description: 'Institution ID for multi-tenant' })
  institutionId?: string;
}
