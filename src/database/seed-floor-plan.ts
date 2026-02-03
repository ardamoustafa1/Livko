/**
 * Zemin Kat planını sisteme ekler.
 * PDF: Mimari Zemin Kat-Model (1).pdf - eksiksiz ve hatasız.
 * Kullanım: npx ts-node -r tsconfig-paths/register src/database/seed-floor-plan.ts
 */
import { DataSource } from 'typeorm';
import { Institution } from '../modules/institution/entities/institution.entity';
import { Building } from '../modules/building/entities/building.entity';
import { Floor } from '../modules/floor/entities/floor.entity';
import { Room } from '../modules/room/entities/room.entity';
import { Elevator } from '../modules/elevator/entities/elevator.entity';
import { Stair } from '../modules/stair/entities/stair.entity';
import { Exit } from '../modules/exit/entities/exit.entity';
import {
  ZEMIN_KAT_ROOMS,
  ZEMIN_KAT_ELEVATORS,
  ZEMIN_KAT_STAIRS,
  ZEMIN_KAT_EXITS,
  ZEMIN_KAT_META,
} from './floor-plans/zemin-kat-data';

const INSTITUTION_SLUG = 'ornek-hastane';
const BUILDING_NAME = 'Ana Bina (MS-BL8A)';

async function seedFloorPlan() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'navuser',
    password: process.env.POSTGRES_PASSWORD || 'navpass',
    database: process.env.POSTGRES_DB || 'indoor_navigation',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
  });

  await dataSource.initialize();

  const institutionRepo = dataSource.getRepository(Institution);
  const buildingRepo = dataSource.getRepository(Building);
  const floorRepo = dataSource.getRepository(Floor);
  const roomRepo = dataSource.getRepository(Room);
  const elevatorRepo = dataSource.getRepository(Elevator);
  const stairRepo = dataSource.getRepository(Stair);
  const exitRepo = dataSource.getRepository(Exit);

  let institution = await institutionRepo.findOne({ where: { slug: INSTITUTION_SLUG } });
  if (!institution) {
    institution = institutionRepo.create({
      name: 'Örnek Hastane',
      slug: INSTITUTION_SLUG,
      settings: { floorPlanSource: ZEMIN_KAT_META.planSource },
    });
    institution = await institutionRepo.save(institution);
    console.log('Created institution:', institution.name);
  } else {
    console.log('Using existing institution:', institution.name);
  }

  let building = await buildingRepo.findOne({
    where: { institutionId: institution.id },
  });
  if (!building) {
    building = buildingRepo.create({
      name: BUILDING_NAME,
      institutionId: institution.id,
      address: null,
    });
    building = await buildingRepo.save(building);
    console.log('Created building:', building.name);
  } else {
    console.log('Using existing building:', building.name);
  }

  let floor = await floorRepo.findOne({
    where: { buildingId: building.id, level: ZEMIN_KAT_META.level },
  });
  if (!floor) {
    floor = floorRepo.create({
      level: ZEMIN_KAT_META.level,
      buildingId: building.id,
      name: ZEMIN_KAT_META.floorName,
      floorPlanUrl: null,
    });
    floor = await floorRepo.save(floor);
    console.log('Created floor:', floor.name, 'level', floor.level);
  } else {
    console.log('Using existing floor:', floor.name);
  }

  let roomsCreated = 0;
  for (const r of ZEMIN_KAT_ROOMS) {
    const existing = await roomRepo.findOne({
      where: { floorId: floor.id, roomNumber: r.code },
    });
    if (existing) continue;
    const room = roomRepo.create({
      floorId: floor.id,
      name: r.name,
      functionType: r.functionType,
      roomNumber: r.code,
      areaSqm: r.areaSqm,
      isAccessible: r.isAccessible,
      xPosition: r.gridX ?? null,
      yPosition: r.gridY ?? null,
    });
    await roomRepo.save(room);
    roomsCreated++;
  }
  console.log('Rooms: %d new (total %d on floor)', roomsCreated, ZEMIN_KAT_ROOMS.length);

  for (const e of ZEMIN_KAT_ELEVATORS) {
    const existing = await elevatorRepo.findOne({
      where: { floorId: floor.id, name: e.name },
    });
    if (existing) continue;
    const elevator = elevatorRepo.create({
      floorId: floor.id,
      name: e.name,
      isActive: true,
      isAccessible: e.isAccessible,
    });
    await elevatorRepo.save(elevator);
  }
  console.log('Elevators: %d on floor', await elevatorRepo.count({ where: { floorId: floor.id } }));

  for (const s of ZEMIN_KAT_STAIRS) {
    const existing = await stairRepo.findOne({
      where: { floorId: floor.id, name: s.name },
    });
    if (existing) continue;
    const stair = stairRepo.create({
      floorId: floor.id,
      name: s.name,
      isActive: true,
    });
    await stairRepo.save(stair);
  }
  console.log('Stairs: %d on floor', await stairRepo.count({ where: { floorId: floor.id } }));

  for (const ex of ZEMIN_KAT_EXITS) {
    const existing = await exitRepo.findOne({
      where: { floorId: floor.id, name: ex.name },
    });
    if (existing) continue;
    const exitEntity = exitRepo.create({
      floorId: floor.id,
      name: ex.name,
      exitType: ex.isEmergencyExit ? 'emergency' : 'main',
      isEmergencyExit: ex.isEmergencyExit,
    });
    await exitRepo.save(exitEntity);
  }
  console.log('Exits: %d on floor', await exitRepo.count({ where: { floorId: floor.id } }));

  await dataSource.destroy();
  console.log('Zemin Kat floor plan seed completed.');
}

seedFloorPlan().catch((e) => {
  console.error(e);
  process.exit(1);
});
