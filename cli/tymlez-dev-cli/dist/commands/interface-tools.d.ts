import type { Argv } from 'yargs';
declare const handler: () => void;
declare const command = "interface-tools";
declare const desc = "Tools for interface files";
declare const builder: (yargs: Argv) => Argv<{}>;
export { command, desc, builder, handler };
