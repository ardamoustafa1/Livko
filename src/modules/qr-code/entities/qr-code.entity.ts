import { Column, Entity, Index, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Room } from '../../room/entities/room.entity';

@Entity('qr_codes')
export class QrCode extends BaseEntity {
  @Column({ type: 'varchar', length: 128, unique: true })
  @Index('idx_qr_codes_code', { unique: true })
  code: string;

  @Column({ type: 'uuid', name: 'room_id', nullable: true })
  @Index('idx_qr_codes_room_id')
  roomId: string | null;

  @ManyToOne(() => Room, (r) => r.qrCodes, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'room_id' })
  room: Room | null;

  @Column({ type: 'varchar', length: 64, nullable: true })
  graphNodeId: string | null;

  @Column({ type: 'varchar', length: 32, nullable: true })
  nodeType: string | null;
}
