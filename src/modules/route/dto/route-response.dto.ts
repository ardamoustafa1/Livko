import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RouteStepDto {
  @ApiProperty()
  nodeId: string;

  @ApiProperty()
  instruction: string;

  @ApiPropertyOptional()
  order?: number;
}

export class RouteResponseDto {
  @ApiProperty({ type: [String], description: 'Ordered list of node IDs' })
  path: string[];

  @ApiProperty({ type: [RouteStepDto], description: 'Step-by-step instructions' })
  instructions: RouteStepDto[];

  @ApiProperty({ description: 'Total distance in meters' })
  totalDistance: number;

  @ApiProperty({ description: 'Estimated time in seconds' })
  estimatedTimeSeconds: number;
}
