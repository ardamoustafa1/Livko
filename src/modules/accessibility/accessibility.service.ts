import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessibilityRule } from './entities/accessibility-rule.entity';
import { CreateAccessibilityRuleDto } from './dto/create-accessibility-rule.dto';
import { UpdateAccessibilityRuleDto } from './dto/update-accessibility-rule.dto';

@Injectable()
export class AccessibilityService {
  constructor(
    @InjectRepository(AccessibilityRule)
    private readonly repo: Repository<AccessibilityRule>,
  ) {}

  async create(dto: CreateAccessibilityRuleDto): Promise<AccessibilityRule> {
    const entity = this.repo.create(dto);
    return this.repo.save(entity);
  }

  async findAll(institutionId?: string): Promise<AccessibilityRule[]> {
    const qb = this.repo.createQueryBuilder('a');
    if (institutionId) qb.andWhere('a.institutionId = :institutionId', { institutionId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<AccessibilityRule> {
    const entity = await this.repo.findOne({ where: { id } });
    if (!entity) throw new NotFoundException('Accessibility rule not found');
    return entity;
  }

  async findByMode(institutionId: string, mode: string): Promise<AccessibilityRule | null> {
    return this.repo.findOne({ where: { institutionId, mode } });
  }

  async update(id: string, dto: UpdateAccessibilityRuleDto): Promise<AccessibilityRule> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    return this.repo.save(entity);
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.repo.softRemove(entity);
  }
}
