import { Column, Entity, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Floor } from '../../floor/entities/floor.entity';
import { QrCode } from '../../qr-code/entities/qr-code.entity';

@Entity('rooms')
export class Room extends BaseEntity {
  @Column({ type: 'uuid', name: 'floor_id' })
  @Index('idx_rooms_floor_id')
  floorId: string;

  @ManyToOne(() => Floor, (f) => f.rooms, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'floor_id' })
  floor: Floor;

  @Column()
  name: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  functionType: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  roomNumber: string | null;

  @Column({ type: 'float', nullable: true })
  xPosition: number | null;

  @Column({ type: 'float', nullable: true })
  yPosition: number | null;

  @Column({ type: 'boolean', default: true })
  isAccessible: boolean;

  @OneToMany(() => QrCode, (q) => q.room)
  qrCodes: QrCode[];
}
