#!/usr/bin/env -S node -r esbuild-register
import { logger } from '@tymlez/backend-libs';

import Yargs from 'yargs/yargs';
import { deploy } from '../lib/deploy';

async function main(): Promise<void> {
  const rootYargs = Yargs(process.argv.slice(2));

  await rootYargs
    .command('deploy', 'Deploy', {}, deploy)
    .demandCommand()
    .strict()
    .help().argv;
}

main().catch((err) => {
  logger.error({ err }, 'Failed to execute.');
  process.exit(1);
});
