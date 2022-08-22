import type { IIsoDate } from '@tymlez/platform-api-interfaces';
import assert from 'assert';
import { readdirSync } from 'fs';
import { first, partition } from 'lodash';
import { join, parse, relative } from 'path';
import type { ClientBase } from 'pg';
import { STS } from 'aws-sdk';
import { getMeterDbPool, logger } from '@tymlez/backend-libs';
import { MIGRATION_BASE_PATH } from './constants';

type MigrationPayload = {
  client: ClientBase;
  migrationFiles: IMigrationFileInfo[];
};

export async function migrationUp(): Promise<void> {
  await migration(runMigrateUp);
}

export async function migrationDown(): Promise<void> {
  await migration(runMigrateDown, true);
}

const migration = async (
  runAction: (payload: MigrationPayload) => Promise<void>,
  down?: boolean,
): Promise<void> => {
  const sts = new STS();
  if (process.env.ENV !== 'local') {
    assert(process.env.ENV, 'ENV is missing');
    assert(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');

    const { Arn: callerArn } = await sts.getCallerIdentity().promise();
    const fullEnv = `${process.env.CLIENT_NAME}-${process.env.ENV}`;
    assert(
      callerArn?.includes(`/ci-${fullEnv}`),
      `AWS caller: ${callerArn} not allow to run migrationUp for ${fullEnv}`,
    );
  }

  const pool = getMeterDbPool();

  try {
    const client = await pool.connect();

    try {
      await createMigrationsTable(client);

      const lastMigratedInfo = await getLastMigratedInfo(client);

      const migrationFiles = getMigrationFiles();

      const [pendingMigrationFiles, ignoredMigrationFiles] = partition(
        migrationFiles,
        (file) => {
          return down
            ? !lastMigratedInfo || file.name <= lastMigratedInfo.name
            : !lastMigratedInfo || file.name > lastMigratedInfo.name;
        },
      );

      logger.info(
        {
          lastMigratedInfo,
          ignoredMigrationFiles: ignoredMigrationFiles.map((file) => file.name),
          pendingMigrationFiles: pendingMigrationFiles.map((file) => file.name),
        },
        `Start migrate ${down ? 'down' : 'up'}`,
      );

      await client.query('BEGIN');

      await runAction({ client, migrationFiles: pendingMigrationFiles });

      await client.query('COMMIT');
    } catch (err) {
      logger.error({ err }, 'Failed to migrate');
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } finally {
    await pool.end();
  }
};

async function createMigrationsTable(client: ClientBase): Promise<void> {
  await client.query(
    `
      CREATE TABLE IF NOT EXISTS tymlez_meter_db_migrations (
        executedAt TIMESTAMP, name Symbol
      ) timestamp(executedAt) partition by DAY;
    `,
  );
}

async function getLastMigratedInfo(
  client: ClientBase,
): Promise<IMigratedInfo | undefined> {
  const { rows: migratedInfos } = await client.query(
    `SELECT * FROM tymlez_meter_db_migrations ORDER BY name DESC LIMIT 1;`,
  );

  assert(
    migratedInfos.length <= 1,
    `Number of migratedInfos is ${migratedInfos.length}, expect <= 1`,
  );

  return first(migratedInfos);
}

async function runMigrateUp({
  client,
  migrationFiles,
}: MigrationPayload): Promise<void> {
  for (const migrationFile of migrationFiles) {
    logger.info('Migrating', migrationFile.name);

    const { up } = require(migrationFile.requirePath);
    await up(client);

    await client.query(
      'INSERT INTO tymlez_meter_db_migrations VALUES(now(), $1);',
      [migrationFile.name],
    );
  }
}

async function runMigrateDown({
  client,
  migrationFiles,
}: MigrationPayload): Promise<void> {
  for (const migrationFile of migrationFiles) {
    logger.info('Migrating down', migrationFile.name);

    const { down } = require(migrationFile.requirePath);
    if (down) {
      await down(client);
    } else {
      logger.info('No migration down function');
    }
  }
  const { rows } = await client.query(
    'SELECT * FROM tymlez_meter_db_migrations',
  );
  await client.query('DROP TABLE tymlez_meter_db_migrations');
  await createMigrationsTable(client);
  const queries = [];
  for (const row of rows) {
    if (!migrationFiles.map((f) => f.name).includes(row.name)) {
      queries.push(
        client.query('INSERT INTO tymlez_meter_db_migrations VALUES($1, $2)', [
          row.executedAt,
          row.name,
        ]),
      );
    }
  }
  await Promise.all(queries);
}

function getMigrationFiles(): IMigrationFileInfo[] {
  const migrationFiles = getFiles(MIGRATION_BASE_PATH)
    .filter((file) => /\.(ts|js)/.test(parse(file).ext))
    .map((file) => ({
      name: parse(file).name,
      fileName: file,
      requirePath: relative(__dirname, join(MIGRATION_BASE_PATH, file)),
    }));

  return migrationFiles;
}

function getFiles(source: string): string[] {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => dirent.name)
    .sort();
}

interface IMigrationFileInfo {
  name: string;
  fileName: string;
  requirePath: string;
}

interface IMigratedInfo {
  name: string;
  executedAt: IIsoDate;
}
