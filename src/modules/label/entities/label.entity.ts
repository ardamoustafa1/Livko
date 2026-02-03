import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';

@Entity('labels')
@Index('idx_labels_entity', ['institutionId', 'entityType', 'entityId', 'locale'])
export class Label extends BaseEntity {
  @Column({ type: 'uuid', name: 'institution_id' })
  @Index('idx_labels_institution_id')
  institutionId: string;

  @Column({ type: 'varchar', length: 32, name: 'entity_type' })
  entityType: string;

  @Column({ type: 'uuid', name: 'entity_id' })
  entityId: string;

  @Column({ type: 'varchar', length: 16 })
  locale: string;

  @Column({ type: 'varchar', length: 64 })
  key: string;

  @Column({ type: 'text' })
  value: string;
}
