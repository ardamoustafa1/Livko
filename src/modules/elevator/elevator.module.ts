import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Elevator } from './entities/elevator.entity';
import { ElevatorService } from './elevator.service';
import { ElevatorController } from './elevator.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Elevator])],
  controllers: [ElevatorController],
  providers: [ElevatorService],
  exports: [ElevatorService],
})
export class ElevatorModule {}
