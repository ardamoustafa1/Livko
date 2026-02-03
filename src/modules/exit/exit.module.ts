import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exit } from './entities/exit.entity';
import { ExitService } from './exit.service';
import { ExitController } from './exit.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Exit])],
  controllers: [ExitController],
  providers: [ExitService],
  exports: [ExitService],
})
export class ExitModule {}
