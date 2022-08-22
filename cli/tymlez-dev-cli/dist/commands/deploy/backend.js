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
exports.handler = exports.builder = exports.desc = exports.command = void 0;
const index_1 = require("./backend/index");
const handler = ({ context, type }) => __awaiter(void 0, void 0, void 0, function* () {
    const workingDir = context || process.env.INIT_CWD;
    process.chdir(workingDir);
    yield (0, index_1.deploy)(type);
});
exports.handler = handler;
const command = 'backend [context]';
exports.command = command;
const desc = 'Build docker image and publish to ECR, Apply terraform deployment';
exports.desc = desc;
const builder = {
    context: {
        aliases: ['context', 'c'],
        type: 'string',
        required: false,
        desc: 'The working directory',
    },
    type: {
        aliases: ['type', 't'],
        type: 'string',
        choices: ['tymlez', 'client'],
        required: true,
        desc: 'Type of ECR registry',
    },
};
exports.builder = builder;
//# sourceMappingURL=backend.js.map