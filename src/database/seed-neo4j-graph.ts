/**
 * Zemin Kat için Neo4j grafiğini oluşturur: bölge (zone) tabanlı topoloji.
 * Odalar önce bölge hub'ına (koridor/hol), hub'lar ana hole ve birbirine bağlanır.
 *
 * Kullanım: npm run seed:neo4j-graph
 * Önce: npm run seed:floor-plan
 */
import { DataSource } from 'typeorm';
import neo4j, { Driver } from 'neo4j-driver';
import { Institution } from '../modules/institution/entities/institution.entity';
import { Building } from '../modules/building/entities/building.entity';
import { Floor } from '../modules/floor/entities/floor.entity';
import { Room } from '../modules/room/entities/room.entity';
import { Elevator } from '../modules/elevator/entities/elevator.entity';
import { Stair } from '../modules/stair/entities/stair.entity';
import { Exit } from '../modules/exit/entities/exit.entity';
import { getZoneHubForRoomNumber, ZONE_HUB_EDGES } from './floor-plans/zemin-kat-zones';

const INSTITUTION_SLUG = 'ornek-hastane';
const MAIN_HUB_ROOM_NUMBER = 'ZK-093';
const ROOM_TO_ZONE_DISTANCE = 8;
const ZONE_TO_ZONE_DISTANCE = 25;
const HUB_TO_EXIT_DISTANCE = 20;
const EMERGENCY_DISTANCE = 25;

async function seedNeo4jGraph() {
  const pg = new DataSource({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'navuser',
    password: process.env.POSTGRES_PASSWORD || 'navpass',
    database: process.env.POSTGRES_DB || 'indoor_navigation',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
  });
  await pg.initialize();

  const driver: Driver = neo4j.driver(
    process.env.NEO4J_URI || 'bolt://localhost:7687',
    neo4j.auth.basic(
      process.env.NEO4J_USERNAME || 'neo4j',
      process.env.NEO4J_PASSWORD || '',
    ),
  );

  try {
    const institution = await pg.getRepository(Institution).findOne({ where: { slug: INSTITUTION_SLUG } });
    if (!institution) {
      console.error('Institution ornek-hastane not found. Run seed:floor-plan first.');
      process.exit(1);
    }
    const building = await pg.getRepository(Building).findOne({ where: { institutionId: institution.id } });
    if (!building) {
      console.error('Building not found.');
      process.exit(1);
    }
    const floor = await pg.getRepository(Floor).findOne({ where: { buildingId: building.id, level: 0 } });
    if (!floor) {
      console.error('Zemin Kat floor not found.');
      process.exit(1);
    }

    const rooms = await pg.getRepository(Room).find({ where: { floorId: floor.id }, order: { roomNumber: 'ASC' } });
    const elevators = await pg.getRepository(Elevator).find({ where: { floorId: floor.id } });
    const stairs = await pg.getRepository(Stair).find({ where: { floorId: floor.id } });
    const exits = await pg.getRepository(Exit).find({ where: { floorId: floor.id } });

    if (rooms.length === 0) {
      console.error('No rooms on floor. Run seed:floor-plan first.');
      process.exit(1);
    }

    const roomByNumber = new Map<string, Room>();
    for (const r of rooms) {
      if (r.roomNumber) roomByNumber.set(r.roomNumber.toUpperCase(), r);
    }
    const mainHubRoom = rooms.find((r) => r.roomNumber?.toUpperCase() === MAIN_HUB_ROOM_NUMBER) ?? rooms[0];
    const mainExit = exits.find((e) => !e.isEmergencyExit) ?? exits[0];
    const emergencyExit = exits.find((e) => e.isEmergencyExit) ?? mainExit;

    const session = driver.session();

    try {
      for (const r of rooms) {
        await session.run(
          `MERGE (n:Room {id: $id}) SET n.name = $name, n.areaSqm = $areaSqm`,
          { id: r.id, name: r.name, areaSqm: r.areaSqm ?? 0 },
        );
      }
      for (const e of elevators) {
        await session.run(
          `MERGE (n:Elevator {id: $id}) SET n.name = $name`,
          { id: e.id, name: e.name || e.id },
        );
      }
      for (const s of stairs) {
        await session.run(
          `MERGE (n:Stair {id: $id}) SET n.name = $name`,
          { id: s.id, name: s.name || s.id },
        );
      }
      for (const ex of exits) {
        await session.run(
          `MERGE (n:Exit {id: $id}) SET n.name = $name, n.isEmergencyExit = $emergency`,
          { id: ex.id, name: ex.name, emergency: ex.isEmergencyExit },
        );
      }
      console.log('Nodes: %d Room, %d Elevator, %d Stair, %d Exit', rooms.length, elevators.length, stairs.length, exits.length);

      for (const r of rooms) {
        const zoneHubNumber = getZoneHubForRoomNumber(r.roomNumber);
        const zoneHub = zoneHubNumber ? roomByNumber.get(zoneHubNumber) : null;
        const targetHub = zoneHub && zoneHub.id !== r.id ? zoneHub : mainHubRoom;
        if (targetHub.id === r.id) continue;
        const d = targetHub.id === mainHubRoom.id ? ROOM_TO_ZONE_DISTANCE * 1.5 : ROOM_TO_ZONE_DISTANCE;
        const t = d / 1.4;
        await session.run(
          `MATCH (a:Room {id: $fromId}), (b:Room {id: $toId})
           MERGE (a)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.0}]->(b)
           MERGE (b)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.0}]->(a)`,
          { fromId: r.id, toId: targetHub.id, d, t },
        );
      }

      for (const [fromNum, toNum] of ZONE_HUB_EDGES) {
        const fromRoom = roomByNumber.get(fromNum);
        const toRoom = roomByNumber.get(toNum);
        if (!fromRoom || !toRoom) continue;
        const d = ZONE_TO_ZONE_DISTANCE;
        const t = d / 1.4;
        await session.run(
          `MATCH (a:Room {id: $fromId}), (b:Room {id: $toId})
           MERGE (a)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.0}]->(b)
           MERGE (b)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.0}]->(a)`,
          { fromId: fromRoom.id, toId: toRoom.id, d, t },
        );
      }
      console.log('CONNECTS_TO: room->zone hub and zone hub<->zone hub');

      for (const e of elevators) {
        const d = 10;
        const t = 8;
        await session.run(
          `MATCH (a:Room {id: $hubId}), (b:Elevator {id: $id})
           MERGE (a)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.2}]->(b)
           MERGE (b)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.2}]->(a)`,
          { hubId: mainHubRoom.id, id: e.id, d, t },
        );
      }
      for (const s of stairs) {
        const d = 10;
        const t = 8;
        await session.run(
          `MATCH (a:Room {id: $hubId}), (b:Stair {id: $id})
           MERGE (a)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 0}]->(b)
           MERGE (b)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 0}]->(a)`,
          { hubId: mainHubRoom.id, id: s.id, d, t },
        );
      }
      for (const ex of exits) {
        const d = HUB_TO_EXIT_DISTANCE;
        const t = d / 1.4;
        await session.run(
          `MATCH (a:Room {id: $hubId}), (b:Exit {id: $id})
           MERGE (a)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.0}]->(b)
           MERGE (b)-[:CONNECTS_TO {distance: $d, time_cost: $t, accessibility_score: 1.0}]->(a)`,
          { hubId: mainHubRoom.id, id: ex.id, d, t },
        );
      }

      for (const r of rooms) {
        if (mainExit) {
          await session.run(
            `MATCH (a:Room {id: $roomId}), (b:Exit {id: $exitId})
             MERGE (a)-[:EMERGENCY_PATH {distance: $d, time_cost: $t}]->(b)`,
            { roomId: r.id, exitId: mainExit.id, d: EMERGENCY_DISTANCE, t: EMERGENCY_DISTANCE / 1.2 },
          );
        }
        if (emergencyExit && emergencyExit.id !== mainExit?.id) {
          await session.run(
            `MATCH (a:Room {id: $roomId}), (b:Exit {id: $exitId})
             MERGE (a)-[:EMERGENCY_PATH {distance: $d, time_cost: $t}]->(b)`,
            { roomId: r.id, exitId: emergencyExit.id, d: EMERGENCY_DISTANCE, t: EMERGENCY_DISTANCE / 1.2 },
          );
        }
      }
      for (const ex of exits) {
        await session.run(
          `MATCH (a:Room {id: $hubId}), (b:Exit {id: $exitId})
           MERGE (a)-[:EMERGENCY_PATH {distance: $d, time_cost: $t}]->(b)`,
          { hubId: mainHubRoom.id, exitId: ex.id, d: HUB_TO_EXIT_DISTANCE, t: HUB_TO_EXIT_DISTANCE / 1.2 },
        );
      }
      console.log('EMERGENCY_PATH edges created.');
    } finally {
      await session.close();
    }

    await driver.close();
  } finally {
    await pg.destroy();
  }
  console.log('Neo4j graph seed (zone topology) completed.');
}

seedNeo4jGraph().catch((e) => {
  console.error(e);
  process.exit(1);
});
