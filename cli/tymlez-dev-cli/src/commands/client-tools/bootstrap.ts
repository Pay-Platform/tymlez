import type { Argv } from 'yargs';
// eslint-disable-next-line @typescript-eslint/no-empty-function
const handler = () => {
  console.log('Please run --help to see other options');
};
const command = 'bootstrap';
const desc = 'Bootstrap tools for client';
const builder = (yargs: Argv) =>
  yargs
    .commandDir(command, {
      extensions: ['ts', 'js'],
      recurse: false,
      include: (file) => file.includes('command'),
      exclude: /test|d\.ts/,
    })
    .demandCommand();
export { command, desc, builder, handler };
