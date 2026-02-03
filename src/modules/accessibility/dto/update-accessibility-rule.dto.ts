import { PartialType } from '@nestjs/swagger';
import { CreateAccessibilityRuleDto } from './create-accessibility-rule.dto';

export class UpdateAccessibilityRuleDto extends PartialType(CreateAccessibilityRuleDto) {}
