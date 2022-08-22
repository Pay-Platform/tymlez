"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const handler = () => {
    console.log('please run --help to see other options');
};
exports.handler = handler;
const command = 'deploy';
exports.command = command;
const desc = 'deploy CLI';
exports.desc = desc;
const builder = (yargs) => yargs
    .commandDir(command, {
    extensions: ['ts', 'js'],
    recurse: false,
    exclude: /test|d\.ts/,
})
    .demandCommand();
exports.builder = builder;
//# sourceMappingURL=deploy.js.map