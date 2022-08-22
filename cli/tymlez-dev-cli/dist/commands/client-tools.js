"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const handler = () => {
    console.log('please run --help to see other options');
};
exports.handler = handler;
const command = 'client-tools';
exports.command = command;
const desc = 'Client tools cli';
exports.desc = desc;
const builder = (yargs) => yargs
    .commandDir(command, {
    extensions: ['ts', 'js'],
    recurse: false,
    exclude: /test|d\.ts/,
})
    .demandCommand();
exports.builder = builder;
//# sourceMappingURL=client-tools.js.map