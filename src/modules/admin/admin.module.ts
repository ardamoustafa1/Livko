import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { InstitutionModule } from '../institution/institution.module';
import { BuildingModule } from '../building/building.module';
import { FloorModule } from '../floor/floor.module';
import { RoomModule } from '../room/room.module';

@Module({
  imports: [InstitutionModule, BuildingModule, FloorModule, RoomModule],
  controllers: [AdminController],
})
export class AdminModule {}
