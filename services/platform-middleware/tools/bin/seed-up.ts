/**
 * Keep its dependency minimal
 *
 * Need to be able run in alpine docker container
 */

import dotenv from 'dotenv';
import { seedUp } from '../lib/db/seedUp';

dotenv.config();

async function main(): Promise<void> {
  await seedUp();
}

main().catch((err) => {
  console.log('Failed to execute', err);
  process.exit(1);
});
