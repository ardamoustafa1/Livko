import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsUUID } from 'class-validator';

export class SetEmergencyDto {
  @ApiProperty()
  @IsUUID()
  institutionId: string;

  @ApiProperty()
  @IsBoolean()
  active: boolean;
}
