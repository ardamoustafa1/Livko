import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../../shared/enums/role.enum';

@Injectable()
export class UserService {
  private readonly saltRounds = 12;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('User with this email already exists');
    const passwordHash = await bcrypt.hash(dto.password, this.saltRounds);
    const user = this.userRepository.create({
      email: dto.email,
      passwordHash,
      role: dto.role,
      institutionId: dto.institutionId ?? null,
    });
    return this.userRepository.save(user);
  }

  async findAll(role?: Role, institutionId?: string): Promise<User[]> {
    const qb = this.userRepository.createQueryBuilder('u').where('u.deletedAt IS NULL');
    if (role) qb.andWhere('u.role = :role', { role });
    if (institutionId) qb.andWhere('u.institutionId = :institutionId', { institutionId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (dto.email && dto.email !== user.email) {
      const existing = await this.userRepository.findOne({ where: { email: dto.email } });
      if (existing) throw new ConflictException('User with this email already exists');
    }
    if (dto.password) {
      (user as User & { passwordHash?: string }).passwordHash = await bcrypt.hash(
        dto.password,
        this.saltRounds,
      );
    }
    if (dto.role != null) user.role = dto.role;
    if (dto.institutionId !== undefined) user.institutionId = dto.institutionId;
    if (dto.email != null) user.email = dto.email;
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }
}
