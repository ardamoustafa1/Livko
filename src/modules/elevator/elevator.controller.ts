import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ElevatorService } from './elevator.service';
import { CreateElevatorDto } from './dto/create-elevator.dto';
import { UpdateElevatorDto } from './dto/update-elevator.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';

@ApiTags('Elevators')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('elevators')
export class ElevatorController {
  constructor(private readonly service: ElevatorService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create elevator (Admin only)' })
  create(@Body() dto: CreateElevatorDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'List elevators' })
  @ApiQuery({ name: 'floorId', required: false })
  findAll(@Query('floorId') floorId?: string) {
    return this.service.findAll(floorId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get elevator by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update elevator (Admin only)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateElevatorDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete elevator (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
