import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QrCode } from './entities/qr-code.entity';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { RedisService } from '../../shared/redis/redis.service';

const QR_CACHE_PREFIX = 'qr:';
const QR_CACHE_TTL = 3600;

@Injectable()
export class QrCodeService {
  constructor(
    @InjectRepository(QrCode)
    private readonly repo: Repository<QrCode>,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateQrCodeDto): Promise<QrCode> {
    const existing = await this.repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException('QR code with this value already exists');
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    await this.cacheQrResolution(saved.code, saved);
    return saved;
  }

  async findAll(roomId?: string): Promise<QrCode[]> {
    const qb = this.repo.createQueryBuilder('q');
    if (roomId) qb.andWhere('q.roomId = :roomId', { roomId });
    return qb.getMany();
  }

  async findOne(id: string): Promise<QrCode> {
    const entity = await this.repo.findOne({ where: { id }, relations: ['room'] });
    if (!entity) throw new NotFoundException('QR code not found');
    return entity;
  }

  async findByCode(code: string): Promise<QrCode> {
    const entity = await this.repo.findOne({ where: { code }, relations: ['room'] });
    if (!entity) throw new NotFoundException('QR code not found');
    return entity;
  }

  /** Resolve QR code to graph node ID (cached in Redis). */
  async resolveToNode(code: string): Promise<{ nodeId: string; nodeType?: string } | null> {
    const cacheKey = QR_CACHE_PREFIX + code;
    const cached = await this.redis.get<{ nodeId: string; nodeType?: string }>(cacheKey);
    if (cached) return cached;

    const entity = await this.repo.findOne({ where: { code } });
    if (!entity || !entity.graphNodeId) return null;

    const result = { nodeId: entity.graphNodeId, nodeType: entity.nodeType ?? undefined };
    await this.redis.set(cacheKey, result, QR_CACHE_TTL);
    return result;
  }

  private async cacheQrResolution(code: string, entity: QrCode): Promise<void> {
    if (!entity.graphNodeId) return;
    const cacheKey = QR_CACHE_PREFIX + code;
    await this.redis.set(
      cacheKey,
      { nodeId: entity.graphNodeId, nodeType: entity.nodeType ?? undefined },
      QR_CACHE_TTL,
    );
  }

  async update(id: string, dto: UpdateQrCodeDto): Promise<QrCode> {
    const entity = await this.findOne(id);
    Object.assign(entity, dto);
    const saved = await this.repo.save(entity);
    await this.cacheQrResolution(saved.code, saved);
    return saved;
  }

  async remove(id: string): Promise<void> {
    const entity = await this.findOne(id);
    await this.redis.del(QR_CACHE_PREFIX + entity.code);
    await this.repo.softRemove(entity);
  }
}
