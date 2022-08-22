"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
const assert_1 = __importDefault(require("assert"));
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const getBuildTimeConfig_1 = require("./getBuildTimeConfig");
const { readFile, writeFile } = fs_1.default.promises;
const loadEnv = async () => {
    (0, assert_1.default)(process.env.ENV, 'ENV is missing');
    (0, assert_1.default)(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');
    console.log(`--- Loading ENV for ${process.env.ENV}`);
    const { GUARDIAN_OPERATOR_ID, GUARDIAN_OPERATOR_KEY, GUARDIAN_TYMLEZ_API_KEY, } = await (0, getBuildTimeConfig_1.getBuildTimeConfig)({
        env: process.env.ENV,
        clientName: process.env.CLIENT_NAME,
    });
    // console.log('Updating ./tymlez-service/.env.docker');
    // await updateTemplate({
    //   templateFile: './tymlez-service/.env.docker.template',
    //   data: {
    //     GUARDIAN_OPERATOR_ID,
    //     GUARDIAN_OPERATOR_KEY,
    //     GUARDIAN_TYMLEZ_API_KEY,
    //   },
    // });
    // console.log('Updating ./tymlez-service/.env');
    // await updateTemplate({
    //   templateFile: './tymlez-service/.env.template',
    //   data: {
    //     GUARDIAN_OPERATOR_ID,
    //     GUARDIAN_OPERATOR_KEY,
    //     GUARDIAN_TYMLEZ_API_KEY,
    //   },
    // });
    await updateTemplate({
        templateFile: '.env.template',
        data: {
            GUARDIAN_OPERATOR_ID,
            GUARDIAN_OPERATOR_KEY,
            GUARDIAN_TYMLEZ_API_KEY,
        },
    });
};
exports.loadEnv = loadEnv;
async function updateTemplate({ templateFile, data, }) {
    const templateContent = await readFile(templateFile, 'utf-8');
    await writeFile(templateFile.replace('.template', ''), (0, lodash_1.template)(templateContent)(data));
}
//# sourceMappingURL=loadEnv.js.map