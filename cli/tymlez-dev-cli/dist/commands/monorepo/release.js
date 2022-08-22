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
exports.desc = exports.builder = exports.command = exports.handler = void 0;
const assert_1 = __importDefault(require("assert"));
const exec_sh_1 = require("exec-sh");
const chalk_1 = __importDefault(require("chalk"));
const confirm_1 = require("./libs/confirm");
function handler() {
    return __awaiter(this, void 0, void 0, function* () {
        const { CLIENT_NAME, ENV } = process.env;
        (0, assert_1.default)(ENV, `ENV is missing`);
        (0, assert_1.default)(ENV !== 'local', `Cannot release when ENV is 'local'`);
        (0, assert_1.default)(ENV !== 'dev', `Cannot release when ENV is 'dev', because we continue to release to dev automatically.`);
        (0, assert_1.default)(CLIENT_NAME, `CLIENT_NAME is missing`);
        try {
            yield (0, exec_sh_1.promise)([`git`, `diff-index`, `--quiet`, `HEAD`].join(' '));
        }
        catch (ex) {
            console.error(chalk_1.default.red('Error: Please make sure your git is clean before release.'));
            throw ex;
        }
        const shouldRelease = yield (0, confirm_1.confirm)(`Do you wish to ${CLIENT_NAME}-${ENV} (y/n)?`);
        if (shouldRelease.toLowerCase() === 'y') {
            console.log(`Releasing ${CLIENT_NAME}-${ENV}`);
            yield (0, exec_sh_1.promise)([
                `git`,
                `checkout`,
                `-B`,
                `release/${CLIENT_NAME}/${ENV}`,
                `origin/release/${CLIENT_NAME}/${ENV}`,
            ].join(' '));
            yield (0, exec_sh_1.promise)([`git`, `pull`, `--no-edit`, `origin`, `main`].join(' '));
            yield (0, exec_sh_1.promise)([`git`, `push`].join(' '));
        }
        else {
            console.log('Skip the release');
        }
    });
}
exports.handler = handler;
const command = 'release';
exports.command = command;
const builder = {};
exports.builder = builder;
const desc = 'Release client code base';
exports.desc = desc;
//# sourceMappingURL=release.js.map