import assert from 'assert';
import { readdirSync } from 'fs';
import { join, parse, relative } from 'path';
import type { ClientBase } from 'pg';
import { getMeterDbPool, logger } from '@tymlez/backend-libs';
import { getBuildTimeConfig, IConfig } from '../getBuildTimeConfig';

const SEED_BASE_PATH = './src/seeders';

export async function seedUp(): Promise<void> {
  assert(process.env.ENV, 'ENV is missing');
  assert(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');

  const config = await getBuildTimeConfig({
    env: process.env.ENV,
    clientName: process.env.CLIENT_NAME,
  });

  const pool = getMeterDbPool();

  try {
    const pgClient = await pool.connect();

    try {
      const seedFiles = getSeedFiles();

      logger.info({ seedFiles }, 'Start seed:up');

      await pgClient.query('BEGIN');

      await runSeedUp({ pgClient, seedFiles, config });

      await pgClient.query('COMMIT');
    } catch (err) {
      logger.error({ err }, 'Failed to seed');
      await pgClient.query('ROLLBACK');
      throw err;
    } finally {
      pgClient.release();
    }
  } finally {
    await pool.end();
  }
}

async function runSeedUp({
  pgClient,
  seedFiles,
  config,
}: {
  pgClient: ClientBase;
  seedFiles: ISeedFileInfo[];
  config: IConfig;
}): Promise<void> {
  for (const seedFile of seedFiles) {
    logger.info('Seeding', seedFile.name);

    const { up } = require(seedFile.requirePath);
    if (up) {
      await up(pgClient, config);
    }
  }
}

function getSeedFiles(): ISeedFileInfo[] {
  const files = getFiles(SEED_BASE_PATH);
  const seedFiles = files
    .filter((file) => /\.(ts)/.test(parse(file).ext))
    .map((file) => ({
      name: parse(file).name,
      fileName: file,
      requirePath: relative(__dirname, join(SEED_BASE_PATH, file)),
    }));

  return seedFiles;
}

function getFiles(source: string): string[] {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .sort();
}

interface ISeedFileInfo {
  name: string;
  fileName: string;
  requirePath: string;
}
