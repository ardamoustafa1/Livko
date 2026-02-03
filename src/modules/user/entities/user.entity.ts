import { Column, Entity, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../../shared/base/base.entity';
import { Role } from '../../../shared/enums/role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true })
  @Index('idx_users_email')
  email: string;

  @Column()
  @Exclude()
  passwordHash: string;

  @Column({ type: 'enum', enum: Role })
  role: Role;

  @Column({ type: 'uuid', name: 'institution_id', nullable: true })
  @Index('idx_users_institution_id')
  institutionId: string | null;
}
