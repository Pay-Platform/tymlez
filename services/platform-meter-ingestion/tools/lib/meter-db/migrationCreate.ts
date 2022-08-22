import fs from 'fs';
import { format } from 'date-fns';
import { paramCase } from 'param-case';
import { logger } from '@tymlez/backend-libs';
import { MIGRATION_BASE_PATH } from './constants';

const { writeFile } = fs.promises;

export async function migrationCreate({
  name,
}: {
  name: string;
}): Promise<void> {
  const fileName = `${format(new Date(), 'yyyyMMddHHmmss')}-${paramCase(
    name,
  )}.ts`;

  const filePath = `${MIGRATION_BASE_PATH}/${fileName}`;

  logger.info({ filePath }, 'Creating migration file');

  await writeFile(
    filePath,
    [
      "import type { ClientBase } from 'pg';",
      '',
      'export async function up(client: ClientBase): Promise<void> {',
      '  // await client.query(`CREATE TABLE IF NOT EXISTS meter_channel_info ...`)',
      '}',
    ].join('\n'),
  );
}
