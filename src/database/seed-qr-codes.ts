/**
 * Zemin Kat odaları ve çıkışları için QR kod kayıtları oluşturur.
 * Her oda/çıkış için graphNodeId = PostgreSQL UUID (Neo4j node id ile eşleşir).
 *
 * Kullanım: npm run seed:qr-codes
 * Önce: npm run seed:floor-plan ve npm run seed:neo4j-graph
 */
import { DataSource } from 'typeorm';
import { Institution } from '../modules/institution/entities/institution.entity';
import { Building } from '../modules/building/entities/building.entity';
import { Floor } from '../modules/floor/entities/floor.entity';
import { Room } from '../modules/room/entities/room.entity';
import { Exit } from '../modules/exit/entities/exit.entity';
import { QrCode } from '../modules/qr-code/entities/qr-code.entity';

const INSTITUTION_SLUG = 'ornek-hastane';

async function seedQrCodes() {
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
  const exitRepo = dataSource.getRepository(Exit);
  const qrCodeRepo = dataSource.getRepository(QrCode);

  const institution = await institutionRepo.findOne({ where: { slug: INSTITUTION_SLUG } });
  if (!institution) {
    console.error('Institution ornek-hastane not found. Run seed:floor-plan first.');
    process.exit(1);
  }
  const building = await buildingRepo.findOne({ where: { institutionId: institution.id } });
  if (!building) {
    console.error('Building not found.');
    process.exit(1);
  }
  const floor = await floorRepo.findOne({ where: { buildingId: building.id, level: 0 } });
  if (!floor) {
    console.error('Zemin Kat floor not found.');
    process.exit(1);
  }

  const rooms = await roomRepo.find({ where: { floorId: floor.id } });
  const exits = await exitRepo.find({ where: { floorId: floor.id } });

  let created = 0;
  let updated = 0;

  for (const room of rooms) {
    const code = room.roomNumber || `ROOM-${room.id}`;
    let qr = await qrCodeRepo.findOne({ where: { code } });
    if (qr) {
      qr.roomId = room.id;
      qr.graphNodeId = room.id;
      qr.nodeType = 'Room';
      await qrCodeRepo.save(qr);
      updated++;
    } else {
      qr = qrCodeRepo.create({
        code,
        roomId: room.id,
        graphNodeId: room.id,
        nodeType: 'Room',
      });
      await qrCodeRepo.save(qr);
      created++;
    }
  }

  for (const exit of exits) {
    const code = `EXIT-${exit.id}`;
    let qr = await qrCodeRepo.findOne({ where: { code } });
    if (qr) {
      qr.roomId = null;
      qr.graphNodeId = exit.id;
      qr.nodeType = 'Exit';
      await qrCodeRepo.save(qr);
      updated++;
    } else {
      qr = qrCodeRepo.create({
        code,
        roomId: null,
        graphNodeId: exit.id,
        nodeType: 'Exit',
      });
      await qrCodeRepo.save(qr);
      created++;
    }
  }

  await dataSource.destroy();
  console.log('QR codes seed completed: %d created, %d updated (rooms: %d, exits: %d).', created, updated, rooms.length, exits.length);
}

seedQrCodes().catch((e) => {
  console.error(e);
  process.exit(1);
});
