import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Floor } from '../../floor/entities/floor.entity';

@Entity('exits')
export class Exit extends BaseEntity {
  @Column({ type: 'uuid', name: 'floor_id' })
  @Index('idx_exits_floor_id')
  floorId: string;

  @ManyToOne(() => Floor, (f) => f.exits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'floor_id' })
  floor: Floor;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  exitType: string | null;

  @Column({ type: 'boolean', default: true })
  isEmergencyExit: boolean;
}
