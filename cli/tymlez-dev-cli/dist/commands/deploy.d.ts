import type { Argv } from 'yargs';
declare const handler: () => void;
declare const command = "deploy";
declare const desc = "deploy CLI";
declare const builder: (yargs: Argv) => Argv<{}>;
export { command, desc, builder, handler };
