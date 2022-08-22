#!/usr/bin/env -S node -r esbuild-register
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs/yargs"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootYargs = (0, yargs_1.default)(process.argv.slice(2));
        yield rootYargs
            .commandDir('./commands', {
            extensions: ['ts', 'js'],
            recurse: false,
            exclude: /d\.ts/,
        })
            .demandCommand()
            .strict()
            .help().argv;
    });
}
main().catch((err) => {
    console.error('Failed to execute', err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map