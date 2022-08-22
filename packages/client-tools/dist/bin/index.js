#!/usr/bin/env -S node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
const lodash_1 = require("lodash");
const bootstrap_1 = require("../bootstrap");
async function main() {
    const rootYargs = (0, yargs_1.default)(process.argv.slice(2));
    await rootYargs
        .command('bootstrap', 'Bootstrap Client', (yargs) => {
        return (0, lodash_1.flow)([addValidate, addPutSecrets])(yargs).demandCommand();
    })
        .demandCommand()
        .strict()
        .help().argv;
}
function addValidate(yargs) {
    return yargs.command('validate', 'Validate bootstrap file', (subYargs) => {
        return subYargs.option('filePath', {
            type: 'string',
            description: 'Path to the bootstrap file',
            demandOption: true,
        });
    }, bootstrap_1.validate);
}
function addPutSecrets(yargs) {
    return yargs.command('put-secrets', 'Put secrets to AWS S3 and update the version ID in bootstrap file', (subYargs) => {
        return subYargs
            .option('bootstrapFilePath', {
            type: 'string',
            description: 'Path to the bootstrap file',
            demandOption: true,
        })
            .option('secretsFilePath', {
            type: 'string',
            description: 'Path to the bootstrap secrets file',
            demandOption: true,
        });
    }, bootstrap_1.putSecrets);
}
main().catch((err) => {
    console.error('Failed to execute', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map