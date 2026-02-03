import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { InstitutionService } from '../institution/institution.service';
import { BuildingService } from '../building/building.service';
import { FloorService } from '../floor/floor.service';
import { RoomService } from '../room/room.service';

@ApiTags('Admin')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly institutionService: InstitutionService,
    private readonly buildingService: BuildingService,
    private readonly floorService: FloorService,
    private readonly roomService: RoomService,
  ) {}

  @Get('dashboard')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Admin dashboard summary (counts)' })
  async dashboard() {
    const [institutions, buildings, floors, rooms] = await Promise.all([
      this.institutionService.findAll(),
      this.buildingService.findAll(),
      this.floorService.findAll(),
      this.roomService.findAll(),
    ]);
    return {
      institutionsCount: institutions.length,
      buildingsCount: buildings.length,
      floorsCount: floors.length,
      roomsCount: rooms.length,
    };
  }
}
