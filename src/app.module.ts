import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { InstitutionModule } from './modules/institution/institution.module';
import { BuildingModule } from './modules/building/building.module';
import { FloorModule } from './modules/floor/floor.module';
import { RoomModule } from './modules/room/room.module';
import { ElevatorModule } from './modules/elevator/elevator.module';
import { StairModule } from './modules/stair/stair.module';
import { ExitModule } from './modules/exit/exit.module';
import { QrCodeModule } from './modules/qr-code/qr-code.module';
import { RouteModule } from './modules/route/route.module';
import { AccessibilityModule } from './modules/accessibility/accessibility.module';
import { EmergencyModule } from './modules/emergency/emergency.module';
import { AdminModule } from './modules/admin/admin.module';
import { LabelModule } from './modules/label/label.module';
import { HealthModule } from './health/health.module';
import { typeOrmConfig } from './config/typeorm.config';
import { RedisModule } from './shared/redis/redis.module';
import { Neo4jModule } from './shared/neo4j/neo4j.module';
import { ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env', '.env.local'] }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeOrmConfig(),
    }),
    RedisModule,
    Neo4jModule,
    AuthModule,
    UserModule,
    InstitutionModule,
    BuildingModule,
    FloorModule,
    RoomModule,
    ElevatorModule,
    StairModule,
    ExitModule,
    QrCodeModule,
    RouteModule,
    AccessibilityModule,
    EmergencyModule,
    AdminModule,
    LabelModule,
    HealthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
