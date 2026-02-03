import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Label } from './entities/label.entity';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

@Injectable()
export class LabelService {
  constructor(
    @InjectRepository(Label)
    private readonly repo: Repository<Label>,
  ) {}

  async create(dto: CreateLabelDto): Promise<Label> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(institutionId?: string, entityType?: string, entityId?: string, locale?: string): Promise<Label[]> {
    const qb = this.repo.createQueryBuilder('l').orderBy('l.locale').addOrderBy('l.key');
    if (institutionId) qb.andWhere('l.institutionId = :institutionId', { institutionId });
    if (entityType) qb.andWhere('l.entityType = :entityType', { entityType });
    if (entityId) qb.andWhere('l.entityId = :entityId', { entityId });
    if (locale) qb.andWhere('l.locale = :locale', { locale });
    return qb.getMany();
  }

  async findOne(id: string): Promise<Label> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Label not found');
    return entity;
  }

  async getLabelsForEntity(
    institutionId: string,
    entityType: string,
    entityId: string,
    locale?: string,
  ): Promise<Record<string, string>> {
    const qb = this.repo
      .createQueryBuilder('l')
      .where('l.institutionId = :institutionId', { institutionId })
      .andWhere('l.entityType = :entityType', { entityType })
      .andWhere('l.entityId = :entityId', { entityId });
    if (locale) qb.andWhere('l.locale = :locale', { locale });
    const list = await qb.getMany();
    const out: Record<string, string> = {};
    for (const l of list) {
      const k = locale ? l.key : `${l.locale}.${l.key}`;
      out[k] = l.value;
    }
    return out;
  }

  async update(id: string, dto: UpdateLabelDto): Promise<Label> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
