import type { Argv } from 'yargs';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handler = () => {
  console.log('please run --help to see other options');
};
const command = 'client-tools';
const desc = 'Client tools cli';
const builder = (yargs: Argv) =>
  yargs
    .commandDir(command, {
      extensions: ['ts', 'js'],
      recurse: false,
      exclude: /test|d\.ts/,
    })
    .demandCommand();
export { command, desc, builder, handler };
