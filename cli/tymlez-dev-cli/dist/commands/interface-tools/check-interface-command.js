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
Object.defineProperty(exports, "__esModule", { value: true });
exports.builder = exports.handler = exports.desc = exports.command = void 0;
const getInterfaceFiles_1 = require("./utils/getInterfaceFiles");
const command = 'check-interface [path]';
exports.command = command;
const desc = 'Validate usage of interface';
exports.desc = desc;
const builder = {
    path: {
        aliases: ['path'],
        type: 'string',
        required: false,
        desc: 'The path of the file to check',
    },
};
exports.builder = builder;
function handler({ path }) {
    return __awaiter(this, void 0, void 0, function* () {
        const dirPath = path || process.env.INIT_CWD || __dirname;
        const tsFiles = yield (0, getInterfaceFiles_1.getInterfaceFiles)(dirPath);
        console.log('Checking interface files in %s', dirPath);
        const nonInterfaceFiles = tsFiles.filter((file) => !file.endsWith('.d.ts'));
        if (nonInterfaceFiles.length > 0) {
            throw new Error(`This project can only contain TypeScript interface files (*.d.ts). ` +
                `Following files are not interface: \n${nonInterfaceFiles
                    .map((file) => `  - ${file}`)
                    .join('\n')}`);
        }
        console.log('Pass: All files are TypeScript interface files, total files: %d', tsFiles.length);
    });
}
exports.handler = handler;
//# sourceMappingURL=check-interface-command.js.map