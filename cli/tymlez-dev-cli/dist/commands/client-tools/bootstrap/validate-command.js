"use strict";
/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */
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
exports.builder = exports.handler = exports.desc = exports.command = void 0;
const path_1 = __importDefault(require("path"));
const backend_libs_1 = require("@tymlez/backend-libs");
function handler({ filePath }) {
    return __awaiter(this, void 0, void 0, function* () {
        const bootstrap = require(path_1.default.resolve(filePath));
        yield (0, backend_libs_1.validateBootstrap)({ bootstrap });
        backend_libs_1.logger.info(`Bootstrap file: '${filePath}' is valid`);
    });
}
exports.handler = handler;
const command = 'validate [filePath]';
exports.command = command;
const desc = 'Validate bootstrap file';
exports.desc = desc;
const builder = {
    filePath: {
        aliases: ['filePath', 'f'],
        type: 'string',
        required: true,
        desc: 'Path to the bootstrap file',
    },
};
exports.builder = builder;
//# sourceMappingURL=validate-command.js.map