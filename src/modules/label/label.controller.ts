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
import { LabelService } from './label.service';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';

@ApiTags('Labels')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('labels')
export class LabelController {
  constructor(private readonly service: LabelService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create multi-language label (Admin only)' })
  create(@Body() dto: CreateLabelDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'List labels with optional filters' })
  @ApiQuery({ name: 'institutionId', required: false })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'locale', required: false })
  findAll(
    @Query('institutionId') institutionId?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('locale') locale?: string,
  ) {
    return this.service.findAll(institutionId, entityType, entityId, locale);
  }

  @Get('by-entity/:institutionId/:entityType/:entityId')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get labels for an entity (optionally by locale)' })
  @ApiQuery({ name: 'locale', required: false })
  getByEntity(
    @Param('institutionId', ParseUUIDPipe) institutionId: string,
    @Param('entityType') entityType: string,
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Query('locale') locale?: string,
  ) {
    return this.service.getLabelsForEntity(institutionId, entityType, entityId, locale);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get label by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update label (Admin only)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateLabelDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete label (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
