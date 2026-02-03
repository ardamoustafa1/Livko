import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateLabelDto {
  @ApiProperty()
  @IsUUID()
  institutionId: string;

  @ApiProperty({ example: 'room', description: 'room, floor, building, elevator, stair, exit' })
  @IsString()
  @MaxLength(32)
  entityType: string;

  @ApiProperty()
  @IsUUID()
  entityId: string;

  @ApiProperty({ example: 'tr', description: 'Locale code (tr, en, de, etc.)' })
  @IsString()
  @MinLength(1)
  @MaxLength(16)
  locale: string;

  @ApiProperty({ example: 'name', description: 'Label key (name, description, etc.)' })
  @IsString()
  @MaxLength(64)
  key: string;

  @ApiProperty()
  @IsString()
  value: string;
}
