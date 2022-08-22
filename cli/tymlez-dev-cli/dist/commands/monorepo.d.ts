import type { Argv } from 'yargs';
declare const handler: () => void;
declare const command = "monorepo";
declare const desc = "Monorepo CLI";
declare const builder: (yargs: Argv) => Argv<{}>;
export { command, desc, builder, handler };
