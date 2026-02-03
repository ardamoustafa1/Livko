import { DataSource, DataSourceOptions } from 'typeorm';

export function typeOrmConfig(): DataSourceOptions {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'navuser',
    password: process.env.POSTGRES_PASSWORD || 'navpass',
    database: process.env.POSTGRES_DB || 'indoor_navigation',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../database/migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
  };
}

const dataSource = new DataSource(typeOrmConfig());
export default dataSource;
