import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';

@Injectable()
export class BuildingService {
  constructor(
    @InjectRepository(Building)
    private readonly repo: Repository<Building>,
  ) {}

  async create(dto: CreateBuildingDto): Promise<Building> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(institutionId?: string): Promise<Building[]> {
    const qb = this.repo.createQueryBuilder('b').orderBy('b.name', 'ASC');
    if (institutionId) qb.andWhere('b.institutionId = :institutionId', { institutionId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Building> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['institution'] });
    if (!entity) throw new NotFoundException('Building not found');
    return entity;
  }

  async update(id: string, dto: UpdateBuildingDto): Promise<Building> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
