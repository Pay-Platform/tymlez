import type { Argv } from 'yargs';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const handler = () => {
  console.log('please run --help to see other options');
};
const command = 'interface-tools';
const desc = 'Tools for interface files';
const builder = (yargs: Argv) =>
  yargs
    .commandDir('interface-tools', {
      extensions: ['ts', 'js'],
      recurse: false,
      exclude: /test|d\.ts/,
    })
    .demandCommand();
export { command, desc, builder, handler };
