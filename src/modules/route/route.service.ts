import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '../../shared/redis/redis.service';
import { QrCodeService } from '../qr-code/qr-code.service';
import { EmergencyService } from '../emergency/emergency.service';
import { ComputeRouteDto } from './dto/compute-route.dto';
import { AccessibilityMode } from '../../shared/enums/accessibility-mode.enum';

const ROUTE_CACHE_PREFIX = 'route:';
const ROUTE_CACHE_TTL = 600;

export interface RouteResult {
  path: string[];
  instructions: Array<{ nodeId: string; instruction: string; order?: number }>;
  totalDistance: number;
  estimatedTimeSeconds: number;
}

@Injectable()
export class RouteService {
  private readonly routeServiceUrl: string;

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly qrCodeService: QrCodeService,
    private readonly emergencyService: EmergencyService,
  ) {
    this.routeServiceUrl = this.config.get<string>('ROUTE_SERVICE_URL', 'http://localhost:8000');
  }

  async computeRoute(dto: ComputeRouteDto, institutionId?: string): Promise<RouteResult> {
    const instId = dto.institutionId ?? institutionId;
    let startNodeId = dto.startNodeId;
    let targetNodeId = dto.targetNodeId;

    const emergencyActive = instId
      ? await this.emergencyService.isEmergencyActive(instId)
      : false;
    const useEmergency = dto.emergencyMode === true || emergencyActive;

    const resolvedStart = await this.qrCodeService.resolveToNode(dto.startNodeId);
    if (resolvedStart) startNodeId = resolvedStart.nodeId;

    const resolvedTarget = await this.qrCodeService.resolveToNode(dto.targetNodeId);
    if (resolvedTarget) targetNodeId = resolvedTarget.nodeId;

    if (useEmergency) {
      targetNodeId = 'nearest_exit';
    }

    const cacheKey = `${ROUTE_CACHE_PREFIX}${startNodeId}:${targetNodeId}:${dto.accessibilityMode ?? AccessibilityMode.NONE}:${useEmergency}`;
    const cached = await this.redis.get<RouteResult>(cacheKey);
    if (cached) return cached;

    const accessibilityMode = dto.accessibilityMode ?? AccessibilityMode.NONE;
    const body = {
      start_node_id: startNodeId,
      target_node_id: targetNodeId,
      accessibility_mode: accessibilityMode,
      emergency_mode: useEmergency,
    };

    const url = `${this.routeServiceUrl.replace(/\/$/, '')}/compute-route`;
    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new BadRequestException('Route service unavailable');
    }

    if (!response.ok) {
      const text = await response.text();
      throw new BadRequestException(text || 'Route computation failed');
    }

    const data = (await response.json()) as RouteResult;
    await this.redis.set(cacheKey, data, ROUTE_CACHE_TTL);
    return data;
  }
}
