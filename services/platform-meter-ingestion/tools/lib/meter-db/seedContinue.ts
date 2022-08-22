import assert from 'assert';
import { readdirSync } from 'fs';
import { join, parse, relative } from 'path';
import type { Pool } from 'pg';
import { getMeterDbPool, logger } from '@tymlez/backend-libs';

const SEED_BASE_PATH = './src/seeders';

export async function seedContinue({
  interval,
  file,
}: {
  interval?: number;
  file?: string;
}): Promise<void> {
  assert(process.env.ENV, 'ENV is missing');

  const pool = getMeterDbPool();

  try {
    try {
      const seedFiles = file ? [getFile(file)] : getSeedFiles();

      logger.info({ seedFiles }, 'Start seed:continue ');
      await runSeedContinue({ pool, seedFiles, interval });
      // await pgClient.query('COMMIT');
    } catch (err) {
      logger.error({ err }, 'Failed to seed');
      //       await pgClient.query('ROLLBACK');
      throw err;
    } finally {
      // pgClient.release();
    }
  } finally {
    // await pool.end();
  }
}

async function runSeedContinue({
  pool,
  seedFiles,
  interval,
}: {
  pool: Pool;
  seedFiles: ISeedFileInfo[];
  interval?: number;
}): Promise<void> {
  for (const seedFile of seedFiles) {
    logger.info('Seeding continue', seedFile.name);

    const { runContinue } = require(seedFile.requirePath);
    if (runContinue) {
      await runContinue(pool, {
        interval: interval || 300000,
        BOOTSTRAP_DATA: process.env.BOOTSTRAP_DATA
          ? JSON.parse(process.env.BOOTSTRAP_DATA)
          : undefined,
      });
    }
  }
}

function getSeedFiles(): ISeedFileInfo[] {
  const files = getFiles(SEED_BASE_PATH);
  const seedFiles = files
    .filter((file) => /\.(ts|js)$/.test(parse(file).ext))
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

function getFile(source: string): ISeedFileInfo {
  return {
    name: parse(source).name,
    fileName: source,
    requirePath: relative(__dirname, join(SEED_BASE_PATH, source)),
  };
}

interface ISeedFileInfo {
  name: string;
  fileName: string;
  requirePath: string;
}
