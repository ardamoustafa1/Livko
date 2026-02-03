import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Floor } from '../../floor/entities/floor.entity';

@Entity('stairs')
export class Stair extends BaseEntity {
  @Column({ type: 'uuid', name: 'floor_id' })
  @Index('idx_stairs_floor_id')
  floorId: string;

  @ManyToOne(() => Floor, (f) => f.stairs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'floor_id' })
  floor: Floor;

  @Column({ type: 'varchar', length: 64, nullable: true })
  name: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;
}
