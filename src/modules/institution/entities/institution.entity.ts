import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Building } from '../../building/entities/building.entity';

@Entity('institutions')
export class Institution extends BaseEntity {
  @Column()
  @Index('idx_institutions_name')
  name: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  @Index('idx_institutions_slug', { unique: true })
  slug: string;

  @Column({ type: 'jsonb', nullable: true })
  settings: Record<string, unknown> | null;

  @OneToMany(() => Building, (b) => b.institution)
  buildings: Building[];
}
