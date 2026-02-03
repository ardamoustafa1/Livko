import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity('emergency_states')
export class EmergencyState extends BaseEntity {
  @Column({ type: 'uuid', name: 'institution_id' })
  @Index('idx_emergency_states_institution_id', { unique: true })
  institutionId: string;

  @Column({ type: 'boolean', default: false })
  isActive: boolean;

  @Column({ type: 'uuid', name: 'activated_by', nullable: true })
  activatedBy: string | null;

  @Column({ type: 'timestamptz', name: 'activated_at', nullable: true })
  activatedAt: Date | null;
}
