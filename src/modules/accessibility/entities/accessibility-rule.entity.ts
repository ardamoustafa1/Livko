import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity('accessibility_rules')
export class AccessibilityRule extends BaseEntity {
  @Column({ type: 'uuid', name: 'institution_id' })
  @Index('idx_accessibility_rules_institution_id')
  institutionId: string;

  @Column({ type: 'varchar', length: 32 })
  mode: string;

  @Column({ type: 'boolean', default: true })
  excludeStairs: boolean;

  @Column({ type: 'boolean', default: true })
  preferElevators: boolean;

  @Column({ type: 'boolean', default: false })
  preferWideCorridors: boolean;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, unknown> | null;
}
