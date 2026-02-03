import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly repo: Repository<Room>,
  ) {}

  async create(dto: CreateRoomDto): Promise<Room> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(floorId?: string): Promise<Room[]> {
    const qb = this.repo.createQueryBuilder('r').orderBy('r.name', 'ASC');
    if (floorId) qb.andWhere('r.floorId = :floorId', { floorId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Room> {
    const entity = await this.repo.findOne({
      where: { id },
      relations: ['floor'],
    });
    if (!entity) throw new NotFoundException('Room not found');
    return entity;
  }

  async update(id: string, dto: UpdateRoomDto): Promise<Room> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
