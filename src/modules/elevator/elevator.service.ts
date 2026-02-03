import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Elevator } from './entities/elevator.entity';
import { CreateElevatorDto } from './dto/create-elevator.dto';
import { UpdateElevatorDto } from './dto/update-elevator.dto';

@Injectable()
export class ElevatorService {
  constructor(
    @InjectRepository(Elevator)
    private readonly repo: Repository<Elevator>,
  ) {}

  async create(dto: CreateElevatorDto): Promise<Elevator> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(floorId?: string): Promise<Elevator[]> {
    const qb = this.repo.createQueryBuilder('e');
    if (floorId) qb.andWhere('e.floorId = :floorId', { floorId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Elevator> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['floor'] });
    if (!entity) throw new NotFoundException('Elevator not found');
    return entity;
  }

  async update(id: string, dto: UpdateElevatorDto): Promise<Elevator> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
