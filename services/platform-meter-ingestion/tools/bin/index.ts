#!/usr/bin/env -S node -r esbuild-register

import Yargs from 'yargs/yargs';
import type { Argv } from 'yargs';
import { flow } from 'lodash';
import dotenv from 'dotenv';
import { logger } from '@tymlez/backend-libs';
import { deploy } from '../lib/deploy';
import { loadEnv } from '../lib/loadEnv';
import {
  migrationUp,
  migrationDown,
  migrationCreate,
  seedUp,
  seedContinue,
} from '../lib/meter-db';

dotenv.config();

async function main(): Promise<void> {
  const rootYargs = Yargs(process.argv.slice(2));

  await rootYargs
    .command('deploy', 'Deploy', {}, deploy)
    .command('env', 'Environment', (yargs) => {
      return flow([addLoadEnv])(yargs).demandCommand();
    })
    .command('meter-db', 'Meter DB', (yargs) => {
      return flow([
        addMeterDbMigrationUp,
        addMeterDbMigrationDown,
        addMeterDbMigrationCreate,
        addSeedUp,
        addSeedContinue,
        addSeedDown,
      ])(yargs).demandCommand();
    })
    .demandCommand()
    .strict()
    .help().argv;
}

function addLoadEnv(yargs: Argv): Argv {
  return yargs.command(
    'load',
    'Load environment',
    () => {
      yargs.option('dryRun', {
        type: 'boolean',
        description: 'Dry run',
      });
    },
    loadEnv,
  );
}

function addMeterDbMigrationUp(yargs: Argv): Argv {
  return yargs.command(
    'migration:up',
    'Migrate up to the latest version',
    {},
    migrationUp,
  );
}

function addMeterDbMigrationDown(yargs: Argv): Argv {
  return yargs.command('migration:down', 'Migrate down', {}, migrationDown);
}

function addMeterDbMigrationCreate(yargs: Argv): Argv {
  return yargs.command(
    'migration:create',
    'Create new migration file',
    () => {
      yargs.option('name', {
        type: 'string',
        description: 'Migration file name',
        demandOption: true,
      });
    },
    migrationCreate,
  );
}

function addSeedUp(yargs: Argv): Argv {
  return yargs.command('seed:up', 'Run all seeder files', {}, seedUp);
}

const seedDown = async (): Promise<void> => {
  await migrationDown();
  await migrationUp();
};

function addSeedDown(yargs: Argv): Argv {
  return yargs.command('seed:down', 'Run all seeder files', {}, seedDown);
}

function addSeedContinue(yargs: Argv): Argv {
  return yargs.command(
    'seed:continue',
    'Run all continue seeder files',
    (subYargs) => {
      subYargs.option('interval', {
        type: 'number',
        description: 'Continue interval',
        demandOption: false,
      });
      subYargs.option('file', {
        type: 'string',
        description: 'Seed file to run',
        demandOption: false,
      });
    },
    seedContinue,
  );
}

main().catch((err) => {
  logger.error({ err }, 'Failed to execute');
  process.exit(1);
});
