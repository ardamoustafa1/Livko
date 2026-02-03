import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exit } from './entities/exit.entity';
import { CreateExitDto } from './dto/create-exit.dto';
import { UpdateExitDto } from './dto/update-exit.dto';

@Injectable()
export class ExitService {
  constructor(
    @InjectRepository(Exit)
    private readonly repo: Repository<Exit>,
  ) {}

  async create(dto: CreateExitDto): Promise<Exit> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(floorId?: string): Promise<Exit[]> {
    const qb = this.repo.createQueryBuilder('e');
    if (floorId) qb.andWhere('e.floorId = :floorId', { floorId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Exit> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['floor'] });
    if (!entity) throw new NotFoundException('Exit not found');
    return entity;
  }

  async update(id: string, dto: UpdateExitDto): Promise<Exit> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
