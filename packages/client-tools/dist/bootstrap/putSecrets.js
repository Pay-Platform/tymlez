"use strict";
/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putSecrets = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const aws_sdk_1 = require("aws-sdk");
const deepmerge_1 = __importDefault(require("deepmerge"));
const assert_1 = __importDefault(require("assert"));
const md5_1 = __importDefault(require("md5"));
const backend_libs_1 = require("@tymlez/backend-libs");
const validateBootstrap_1 = require("./validateBootstrap");
const { readFile, writeFile } = fs_1.default.promises;
const s3 = new aws_sdk_1.S3();
const sts = new aws_sdk_1.STS();
async function putSecrets({ bootstrapFilePath, secretsFilePath, }) {
    (0, assert_1.default)(process.env.ENV, `ENV is missing`);
    (0, assert_1.default)(process.env.ENV !== 'local', `Cannot put secrets when ENV is 'local'`);
    (0, assert_1.default)(process.env.CLIENT_NAME, `CLIENT_NAME is missing`);
    const bootstrap = require(path_1.default.resolve(bootstrapFilePath));
    (0, assert_1.default)(bootstrap.client_detail.name === process.env.CLIENT_NAME, `Client name in bootstrap is '${bootstrap.client_detail.name}', expect '${process.env.CLIENT_NAME}'`);
    if (process.env.ENV !== 'local') {
        const { Arn: callerArn } = await sts.getCallerIdentity().promise();
        const fullEnv = `${process.env.CLIENT_NAME}-${process.env.ENV}`;
        (0, assert_1.default)(callerArn?.includes(`/ci-${fullEnv}`), `AWS caller: ${callerArn} not allow to deploy to ${fullEnv}`);
    }
    const bootstrapSecrets = require(path_1.default.resolve(secretsFilePath));
    const bootstrapWithSecrets = (0, deepmerge_1.default)(bootstrap, bootstrapSecrets);
    await (0, validateBootstrap_1.validateBootstrap)({
        bootstrap: bootstrapWithSecrets,
        allowSecret: true,
    });
    const bootstrapSecretsText = JSON.stringify(bootstrapSecrets);
    const bootstrapSecretsMd5 = await (0, md5_1.default)(bootstrapSecretsText);
    const secretsBinary = Buffer.from(bootstrapSecretsText, 'binary');
    await s3
        .putObject({
        Bucket: `${process.env.ENV}-${process.env.CLIENT_NAME}-tymlez-client-data`,
        Key: `secrets/bootstrap-secrets-${process.env.ENV}-${bootstrapSecretsMd5}.json`,
        Body: secretsBinary,
    })
        .promise();
    const bootstrapContent = await readFile(bootstrapFilePath, 'utf-8');
    const newBootstrapContent = bootstrapContent.replace(/secrets_hash: '[^']+'/, `secrets_hash: '${bootstrapSecretsMd5}'`);
    await writeFile(bootstrapFilePath, newBootstrapContent);
    backend_libs_1.logger.info(`Updated secrets and saved its has (${bootstrapSecretsMd5}) in bootstrap.`);
}
exports.putSecrets = putSecrets;
//# sourceMappingURL=putSecrets.js.map