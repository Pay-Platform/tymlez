"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
// eslint-disable-next-line @typescript-eslint/no-empty-function
const handler = () => {
    console.log('Please run --help to see other options');
};
exports.handler = handler;
const command = 'bootstrap';
exports.command = command;
const desc = 'Bootstrap tools for client';
exports.desc = desc;
const builder = (yargs) => yargs
    .commandDir(command, {
    extensions: ['ts', 'js'],
    recurse: false,
    include: (file) => file.includes('command'),
    exclude: /test|d\.ts/,
})
    .demandCommand();
exports.builder = builder;
//# sourceMappingURL=bootstrap.js.map