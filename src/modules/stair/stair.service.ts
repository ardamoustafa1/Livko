import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stair } from './entities/stair.entity';
import { CreateStairDto } from './dto/create-stair.dto';
import { UpdateStairDto } from './dto/update-stair.dto';

@Injectable()
export class StairService {
  constructor(
    @InjectRepository(Stair)
    private readonly repo: Repository<Stair>,
  ) {}

  async create(dto: CreateStairDto): Promise<Stair> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(floorId?: string): Promise<Stair[]> {
    const qb = this.repo.createQueryBuilder('s');
    if (floorId) qb.andWhere('s.floorId = :floorId', { floorId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Stair> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['floor'] });
    if (!entity) throw new NotFoundException('Stair not found');
    return entity;
  }

  async update(id: string, dto: UpdateStairDto): Promise<Stair> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
