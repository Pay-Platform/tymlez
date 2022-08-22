"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const handler = () => {
    console.log('please run --help to see other options');
};
exports.handler = handler;
const command = 'monorepo';
exports.command = command;
const desc = 'Monorepo CLI';
exports.desc = desc;
const builder = (yargs) => yargs
    .commandDir(command, {
    extensions: ['ts', 'js'],
    recurse: false,
    exclude: /test/,
})
    .demandCommand();
exports.builder = builder;
//# sourceMappingURL=monorepo.js.map