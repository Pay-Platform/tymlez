#!/usr/bin/env -S node -r esbuild-register

import Yargs from 'yargs/yargs';
import { deploy } from '../lib/deploy';
import { loadEnv } from '../lib/environment';

async function main(): Promise<void> {
  const rootYargs = Yargs(process.argv.slice(2));

  await rootYargs
    .command('deploy', 'Deploy', {}, deploy)
    .command('load-env', 'Load .env', {}, loadEnv)
    .demandCommand()
    .strict()
    .help().argv;
}

main().catch((err) => {
  console.error('Failed to execute', err);
  process.exit(1);
});
