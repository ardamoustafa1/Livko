import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stair } from './entities/stair.entity';
import { StairService } from './stair.service';
import { StairController } from './stair.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stair])],
  controllers: [StairController],
  providers: [StairService],
  exports: [StairService],
})
export class StairModule {}
