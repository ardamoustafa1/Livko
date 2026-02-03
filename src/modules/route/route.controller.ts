import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RouteService } from './route.service';
import { ComputeRouteDto } from './dto/compute-route.dto';
import { RouteResponseDto } from './dto/route-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Role } from '../../shared/enums/role.enum';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Routes')
@Controller('routes')
export class RouteController {
  constructor(private readonly service: RouteService) {}

  @Post('compute')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Compute route between two nodes' })
  @ApiResponse({ status: 200, type: RouteResponseDto })
  @ApiResponse({ status: 400, description: 'Route service unavailable or invalid request' })
  async compute(
    @Body() dto: ComputeRouteDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<RouteResponseDto> {
    const result = await this.service.computeRoute(dto, user.institutionId ?? undefined);
    return {
      path: result.path,
      instructions: result.instructions,
      totalDistance: result.totalDistance,
      estimatedTimeSeconds: result.estimatedTimeSeconds,
    };
  }

  @Post('compute-public')
  @ApiOperation({ summary: 'Compute route (public, e.g. for end-user navigation)' })
  @ApiResponse({ status: 200, type: RouteResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid request or route service unavailable' })
  @ApiResponse({ status: 404, description: 'No route found' })
  async computePublic(@Body() dto: ComputeRouteDto): Promise<RouteResponseDto> {
    const result = await this.service.computeRoute(dto);
    return {
      path: result.path,
      instructions: result.instructions,
      totalDistance: result.totalDistance,
      estimatedTimeSeconds: result.estimatedTimeSeconds,
    };
  }
}
