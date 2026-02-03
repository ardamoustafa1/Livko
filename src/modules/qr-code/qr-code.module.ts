import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QrCode } from './entities/qr-code.entity';
import { QrCodeService } from './qr-code.service';
import { QrCodeController } from './qr-code.controller';

@Module({
  imports: [TypeOrmModule.forFeature([QrCode])],
  controllers: [QrCodeController],
  providers: [QrCodeService],
  exports: [QrCodeService],
})
export class QrCodeModule {}
