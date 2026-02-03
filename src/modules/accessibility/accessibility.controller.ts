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
import { AccessibilityService } from './accessibility.service';
import { CreateAccessibilityRuleDto } from './dto/create-accessibility-rule.dto';
import { UpdateAccessibilityRuleDto } from './dto/update-accessibility-rule.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';

@ApiTags('Accessibility')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('accessibility')
export class AccessibilityController {
  constructor(private readonly service: AccessibilityService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create accessibility rule (Admin only)' })
  create(@Body() dto: CreateAccessibilityRuleDto) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'List accessibility rules' })
  @ApiQuery({ name: 'institutionId', required: false })
  findAll(@Query('institutionId') institutionId?: string) {
    return this.service.findAll(institutionId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiOperation({ summary: 'Get accessibility rule by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update accessibility rule (Admin only)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAccessibilityRuleDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Soft delete accessibility rule (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
