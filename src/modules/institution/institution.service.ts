import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Institution } from './entities/institution.entity';
import { CreateInstitutionDto } from './dto/create-institution.dto';
import { UpdateInstitutionDto } from './dto/update-institution.dto';

@Injectable()
export class InstitutionService {
  constructor(
    @InjectRepository(Institution)
    private readonly repo: Repository<Institution>,
  ) {}

  async create(dto: CreateInstitutionDto): Promise<Institution> {
    const existing = await this.repo.findOne({ where: { slug: dto.slug } });
    if (existing) throw new ConflictException('Institution with this slug already exists');
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Institution[]> {
    return this.repo.find({ where: {}, order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Institution> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Institution not found');
    return entity;
  }

  async findBySlug(slug: string): Promise<Institution> {
    const entity = await this.repo.findOne({ where: { slug } });
    if (!entity) throw new NotFoundException('Institution not found');
    return entity;
  }

  async update(id: string, dto: UpdateInstitutionDto): Promise<Institution> {
    const entity = await this.findOne(id);
    if (dto.slug && dto.slug !== entity.slug) {
      const existing = await this.repo.findOne({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Institution with this slug already exists');
    }
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
