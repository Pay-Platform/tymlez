import type { Argv } from 'yargs';
declare const handler: () => void;
declare const command = "client-tools";
declare const desc = "Client tools cli";
declare const builder: (yargs: Argv) => Argv<{}>;
export { command, desc, builder, handler };
