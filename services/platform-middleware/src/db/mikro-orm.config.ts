import type { MikroORMOptions } from '@mikro-orm/core';
import assert from 'assert';
import dotenv from 'dotenv';
import { logger } from '@tymlez/backend-libs';
import { Client } from '../modules/auth/entities/Client.entity';
import { User } from '../modules/auth/entities/User.entity';
import { Installer } from '../modules/installer/entities/installer.entity';
import { Channel } from '../modules/meter-info/entities/Channel.entity';
import { Circuit } from '../modules/meter-info/entities/Circuit.entity';
import { Site } from '../modules/site/entities/Site.entity';
import { Meter } from '../modules/meter-info/entities/Meter.entity';

dotenv.config();

assert(
  process.env.DATABASE_TYPE === 'postgresql',
  `Unexpected DATABASE_TYPE: ${process.env.DATABASE_TYPE}`,
);

const config: Partial<MikroORMOptions> = {
  // Because we use webpack, we cannot use dynamic entities discovery
  // Refer to https://mikro-orm.io/docs/deployment

  // entities: ['./dist/src/**/*.entity.js'],
  // entitiesTs: ['./src/**/*.entity.ts'],
  discovery: { disableDynamicFileAccess: true },
  entities: [Client, User, Site, Meter, Circuit, Channel, Installer],

  dbName: process.env.DATABASE_NAME,
  type: process.env.DATABASE_TYPE,
  clientUrl: process.env.DATABASE_URL,
  tsNode: true,
  migrations: {
    tableName: 'platform_mikro_migrations',
    path: './dist/db/migrations/',
    // pathTs: './dist/db/migrations/',
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts),
    dropTables: false,
    emit: 'ts',
  },

  seeder: {
    path: './dist/db/seeders/', // path to the folder with seeders
    // pathTs: './src/db/seeders/', // path to the folder with TS seeders (if used, we should put path to compiled files in `path`)
    defaultSeeder: 'DatabaseSeeder', // default seeder class name
    glob: '!(*.d).{js,ts}', // how to match seeder files (all .js and .ts files, but not .d.ts)
    emit: 'ts', // seeder generation mode
    fileName: (className: string) => className, // seeder file naming convention
  },
  debug: process.env.ENV === 'local',
  logger: (s) => logger.info(s),
};

export default config;
