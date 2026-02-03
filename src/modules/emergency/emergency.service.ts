import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../../shared/redis/redis.service';
import { EmergencyState } from './entities/emergency-state.entity';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

const EMERGENCY_CACHE_PREFIX = 'emergency:';
const EMERGENCY_CACHE_TTL = 86400;

@Injectable()
export class EmergencyService {
  constructor(
    @InjectRepository(EmergencyState)
    private readonly repo: Repository<EmergencyState>,
    private readonly redis: RedisService,
  ) {}

  async isEmergencyActive(institutionId: string): Promise<boolean> {
    const cacheKey = EMERGENCY_CACHE_PREFIX + institutionId;
    const cached = await this.redis.get<{ active: boolean }>(cacheKey);
    if (cached && typeof cached === 'object' && 'active' in cached) return cached.active;

    const state = await this.repo.findOne({ where: { institutionId } });
    const active = state?.isActive ?? false;
    await this.redis.set(cacheKey, { active }, EMERGENCY_CACHE_TTL);
    return active;
  }

  async setEmergencyState(
    institutionId: string,
    active: boolean,
    user: JwtPayload,
  ): Promise<EmergencyState> {
    let state = await this.repo.findOne({ where: { institutionId } });
    if (!state) {
      state = this.repo.create({ institutionId, isActive: false });
      state = await this.repo.save(state);
    }
    state.isActive = active;
    state.activatedBy = active ? user.sub : null;
    state.activatedAt = active ? new Date() : null;
    const saved = await this.repo.save(state);

    const cacheKey = EMERGENCY_CACHE_PREFIX + institutionId;
    await this.redis.set(cacheKey, { active: saved.isActive }, EMERGENCY_CACHE_TTL);
    return saved;
  }

  async getState(institutionId: string): Promise<EmergencyState> {
    const state = await this.repo.findOne({ where: { institutionId } });
    if (!state) throw new NotFoundException('Emergency state not found for this institution');
    return state;
  }

  async getOrCreateState(institutionId: string): Promise<EmergencyState> {
    let state = await this.repo.findOne({ where: { institutionId } });
    if (!state) {
      state = this.repo.create({ institutionId, isActive: false });
      state = await this.repo.save(state);
    }
    return state;
  }
}
