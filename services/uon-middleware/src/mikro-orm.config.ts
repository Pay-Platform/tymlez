import type { MikroORMOptions } from '@mikro-orm/core';
import { logger } from '@tymlez/backend-libs';
import assert from 'assert';
import dotenv from 'dotenv';

dotenv.config();

assert(
  process.env.DATABASE_TYPE === 'postgresql',
  `Unexpected DATABASE_TYPE: ${process.env.DATABASE_TYPE}`,
);

const config: Partial<MikroORMOptions> = {
  entities: ['./dist/modules/**/entities/*.entity.js'],
  entitiesTs: ['./src/modules/**/entities/*.entity.ts'],
  discovery: { disableDynamicFileAccess: false },
  dbName: process.env.DATABASE_NAME,
  type: process.env.DATABASE_TYPE,
  clientUrl: process.env.DATABASE_URL,
  allowGlobalContext: true,
  migrations: {
    tableName: 'uon_mikro_orm_migrations',
    path: './dist/db/migrations/',
    pathTs: './src/db/migrations/',
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts),
    dropTables: false,
  },
  logger: (s) => logger.info(s),
};

export default config;
