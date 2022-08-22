import type { Argv } from 'yargs';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handler = () => {
  console.log('please run --help to see other options');
};
const command = 'monorepo';
const desc = 'Monorepo CLI';
const builder = (yargs: Argv) =>
  yargs
    .commandDir(command, {
      extensions: ['ts', 'js'],
      recurse: false,
      exclude: /test/,
    })
    .demandCommand();
export { command, desc, builder, handler };
