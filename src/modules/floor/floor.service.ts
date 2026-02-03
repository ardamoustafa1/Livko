import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Floor } from './entities/floor.entity';
import { CreateFloorDto } from './dto/create-floor.dto';
import { UpdateFloorDto } from './dto/update-floor.dto';

@Injectable()
export class FloorService {
  constructor(
    @InjectRepository(Floor)
    private readonly repo: Repository<Floor>,
  ) {}

  async create(dto: CreateFloorDto): Promise<Floor> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(buildingId?: string): Promise<Floor[]> {
    const qb = this.repo.createQueryBuilder('f').orderBy('f.level', 'ASC');
    if (buildingId) qb.andWhere('f.buildingId = :buildingId', { buildingId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Floor> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['building'],
    });
    if (!entity) throw new NotFoundException('Floor not found');
    return entity;
  }

  async update(id: string, dto: UpdateFloorDto): Promise<Floor> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
