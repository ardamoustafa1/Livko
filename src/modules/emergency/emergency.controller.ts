import { Controller, Get, Post, Body, UseGuards, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EmergencyService } from './emergency.service';
import { SetEmergencyDto } from './dto/set-emergency.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import { Role } from '../../shared/enums/role.enum';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@ApiTags('Emergency')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('emergency')
export class EmergencyController {
  constructor(private readonly service: EmergencyService) {}

  @Post('set')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Activate or deactivate emergency mode (Admin only)' })
  setState(@Body() dto: SetEmergencyDto, @CurrentUser() user: JwtPayload) {
    return this.service.setEmergencyState(dto.institutionId, dto.active, user);
  }

  @Get('status/:institutionId')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get emergency status for institution' })
  getStatus(@Param('institutionId', ParseUUIDPipe) institutionId: string) {
    return this.service.getOrCreateState(institutionId);
  }

  @Get('is-active/:institutionId')
  @ApiOperation({ summary: 'Check if emergency is active (can be public for app)' })
  isActive(@Param('institutionId', ParseUUIDPipe) institutionId: string) {
    return this.service.isEmergencyActive(institutionId);
  }
}
