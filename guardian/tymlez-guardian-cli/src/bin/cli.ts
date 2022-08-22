import Yargs from 'yargs/yargs';
import { deploy } from '../deploy';
import { loadEnv } from '../loadEnv';
import { decodeSchemas, init } from '../init';

async function main(): Promise<void> {
  const rootYargs = Yargs(process.argv.slice(2));

  await rootYargs
    .command('deploy', 'Deploy', {}, deploy)
    .command('load-env', 'Load environment variables', {}, loadEnv)
    .command('init', 'Initialize Guardian', {}, init)
    .command('decode-schemas', 'Decode schemas', {}, decodeSchemas)

    .demandCommand()
    .strict()
    .help().argv;
}

main().catch((err) => {
  console.error('Failed to execute', err);
  process.exit(1);
});
