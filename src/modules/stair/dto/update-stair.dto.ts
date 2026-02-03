import { PartialType } from '@nestjs/swagger';
import { CreateStairDto } from './create-stair.dto';

export class UpdateStairDto extends PartialType(CreateStairDto) {}
