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
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const path_1 = __importDefault(require("path"));
const deploy_1 = require("./frontend/deploy");
const handler = ({ env, clientName, source, folder }) => __awaiter(void 0, void 0, void 0, function* () {
    const outputPath = path_1.default.join(process.env.INIT_CWD || '', source);
    const envName = env || process.env.ENV;
    const resolvedClientName = clientName || process.env.CLIENT_NAME;
    yield (0, deploy_1.deploy)(envName, resolvedClientName, outputPath, folder);
});
exports.handler = handler;
const command = 'frontend [source]';
exports.command = command;
const desc = 'deploy front-end application to s3 & cloudfront';
exports.desc = desc;
const builder = {
    env: {
        aliases: ['env', 'e'],
        type: 'string',
        required: false,
        choices: ['dev', 'prod', 'preprod', 'qa'],
        desc: 'Environment to deploy',
    },
    clientName: {
        aliases: ['client-name', 'c'],
        type: 'string',
        required: false,
        desc: 'Client name',
    },
    source: {
        aliases: ['source', 's'],
        type: 'string',
        default: 'out/',
        required: false,
        desc: 'Folder contains output files',
    },
    folder: {
        aliases: ['folder', 'f'],
        default: '',
        type: 'string',
        required: false,
        desc: 'Optional folder where the file will be uploaded to',
    },
};
exports.builder = builder;
//# sourceMappingURL=frontend.js.map