#!/usr/bin/env -S node -r esbuild-register

import Yargs from 'yargs/yargs';
import dotenv from 'dotenv';
import { loadEnv } from '../lib/environment';

dotenv.config();

async function main(): Promise<void> {
  const rootYargs = Yargs(process.argv.slice(2));

  await rootYargs
    .command('load-env', 'Load .env', {}, loadEnv)

    .demandCommand()
    .strict()
    .help().argv;
}

main().catch((error) => {
  console.error('Failed to execute.', error);
  process.exit(1);
});
