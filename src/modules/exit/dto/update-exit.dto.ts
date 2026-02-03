import { PartialType } from '@nestjs/swagger';
import { CreateExitDto } from './create-exit.dto';

export class UpdateExitDto extends PartialType(CreateExitDto) {}
