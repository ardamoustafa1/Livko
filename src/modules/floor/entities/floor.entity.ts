import { Column, Entity, Index, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Building } from '../../building/entities/building.entity';
import { Room } from '../../room/entities/room.entity';
import { Elevator } from '../../elevator/entities/elevator.entity';
import { Stair } from '../../stair/entities/stair.entity';
import { Exit } from '../../exit/entities/exit.entity';

@Entity('floors')
export class Floor extends BaseEntity {
  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'uuid', name: 'building_id' })
  @Index('idx_floors_building_id')
  buildingId: string;

  @ManyToOne(() => Building, (b) => b.floors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'building_id' })
  building: Building;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string | null;

  @Column({ type: 'varchar', length: 512, nullable: true })
  floorPlanUrl: string | null;

  @OneToMany(() => Room, (r) => r.floor)
  rooms: Room[];

  @OneToMany(() => Elevator, (e) => e.floor)
  elevators: Elevator[];

  @OneToMany(() => Stair, (s) => s.floor)
  stairs: Stair[];

  @OneToMany(() => Exit, (e) => e.floor)
  exits: Exit[];
}
