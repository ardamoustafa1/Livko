import { Module } from '@nestjs/common';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';
import { QrCodeModule } from '../qr-code/qr-code.module';
import { EmergencyModule } from '../emergency/emergency.module';

@Module({
  imports: [QrCodeModule, EmergencyModule],
  controllers: [RouteController],
  providers: [RouteService],
  exports: [RouteService],
})
export class RouteModule {}
