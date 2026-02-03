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
import { QrCodeService } from './qr-code.service';
import { CreateQrCodeDto } from './dto/create-qr-code.dto';
import { UpdateQrCodeDto } from './dto/update-qr-code.dto';
import { ResolveQrResponseDto } from './dto/resolve-qr-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';

@ApiTags('QR Codes')
@Controller('qr-codes')
export class QrCodeController {
  constructor(private readonly service: QrCodeService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Create QR code (Admin only)' })
  create(@Body() dto: CreateQrCodeDto) {
    return this.service.create(dto);
  }

  @Get('resolve')
  @ApiOperation({ summary: 'Resolve QR code to node ID (public, for scanning)' })
  @ApiQuery({ name: 'code', required: true })
  async resolve(@Query('code') code: string): Promise<ResolveQrResponseDto | null> {
    const result = await this.service.resolveToNode(code);
    if (!result) return null;
    return result as ResolveQrResponseDto;
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'List QR codes' })
  @ApiQuery({ name: 'roomId', required: false })
  findAll(@Query('roomId') roomId?: string) {
    return this.service.findAll(roomId);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.STAFF)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Get QR code by ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Update QR code (Admin only)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateQrCodeDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'Soft delete QR code (Admin only)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }
}
