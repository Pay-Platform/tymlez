#!/usr/bin/env -S node -r esbuild-register

import Yargs from 'yargs/yargs';
import { logger } from '@tymlez/backend-libs';
import { deploy } from '../lib/deploy';
import { loadEnv } from '../lib/loadEnv';

async function main(): Promise<void> {
  const rootYargs = Yargs(process.argv.slice(2));

  await rootYargs
    .command('deploy', 'Deploy', {}, deploy)
    .command(
      'load-env',
      'Load .env',
      (subYargs) => {
        subYargs.option('dryRun', {
          type: 'boolean',
          description: 'Dry run',
        });
      },
      loadEnv,
    )

    .demandCommand()
    .strict()
    .help().argv;
}

main().catch((err) => {
  logger.error({ err }, 'Failed to executes');
  process.exit(1);
});
