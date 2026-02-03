import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/user/entities/user.entity';
import { Role } from '../shared/enums/role.enum';

const saltRounds = 12;

async function seed() {
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
  const userRepo = dataSource.getRepository(User);

  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hospital.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin123!';

  const existing = await userRepo.findOne({ where: { email: adminEmail } });
  if (existing) {
    console.log('Admin user already exists:', adminEmail);
    await dataSource.destroy();
    return;
  }

  const passwordHash = await bcrypt.hash(adminPassword, saltRounds);
  await userRepo.save(
    userRepo.create({
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      institutionId: null,
    }),
  );
  console.log('Created admin user:', adminEmail);
  await dataSource.destroy();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
