import type { Argv } from 'yargs';
declare const handler: () => void;
declare const command = "bootstrap";
declare const desc = "Bootstrap tools for client";
declare const builder: (yargs: Argv) => Argv<{}>;
export { command, desc, builder, handler };
