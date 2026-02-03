import { Column, Entity, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Institution } from '../../institution/entities/institution.entity';
import { Floor } from '../../floor/entities/floor.entity';

@Entity('buildings')
export class Building extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'uuid', name: 'institution_id' })
  @Index('idx_buildings_institution_id')
  institutionId: string;

  @ManyToOne(() => Institution, (i) => i.buildings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'institution_id' })
  institution: Institution;

  @Column({ type: 'varchar', length: 64, nullable: true })
  address: string | null;

  @OneToMany(() => Floor, (f) => f.building)
  floors: Floor[];
}
