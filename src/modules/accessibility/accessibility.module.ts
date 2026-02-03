import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccessibilityRule } from './entities/accessibility-rule.entity';
import { AccessibilityService } from './accessibility.service';
import { AccessibilityController } from './accessibility.controller';

@Module({
  imports: [TypeOrmModule.forFeature([AccessibilityRule])],
  controllers: [AccessibilityController],
  providers: [AccessibilityService],
  exports: [AccessibilityService],
})
export class AccessibilityModule {}
