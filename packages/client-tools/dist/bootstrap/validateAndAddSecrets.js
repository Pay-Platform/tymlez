'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAndAddSecrets = void 0;
const deep_freeze_strict_1 = __importDefault(require("deep-freeze-strict"));
const assert_1 = __importDefault(require("assert"));
const aws_sdk_1 = require("aws-sdk");
const deepmerge_1 = __importDefault(require("deepmerge"));
const validateBootstrap_1 = require("./validateBootstrap");
const s3 = new aws_sdk_1.S3();
async function validateAndAddSecrets({ env, clientName, bootstrap, }) {
    (0, deep_freeze_strict_1.default)(bootstrap);
    await (0, validateBootstrap_1.validateBootstrap)({ bootstrap });
    const bootstrapSecrets = await fetchBootstrapSecretsFromS3(bootstrap, env, clientName);
    const bootstrapWithSecrets = (0, deepmerge_1.default)(bootstrap, bootstrapSecrets);
    await (0, validateBootstrap_1.validateBootstrap)({
        bootstrap: bootstrapWithSecrets,
        allowSecret: true,
    });
    return bootstrapWithSecrets;
}
exports.validateAndAddSecrets = validateAndAddSecrets;
async function fetchBootstrapSecretsFromS3(bootstrap, env, clientName) {
    (0, assert_1.default)(bootstrap.secrets_hash, `bootstrap.secrets_hash is missing`);
    console.log('fetching booostrap secrets from s3', `secrets/bootstrap-secrets-${env}-${bootstrap.secrets_hash}.json`);
    const { Body: bootstrapSecretsText } = await s3
        .getObject({
        Bucket: `${env}-${clientName}-tymlez-client-data`,
        Key: `secrets/bootstrap-secrets-${env}-${bootstrap.secrets_hash}.json`,
    })
        .promise();
    (0, assert_1.default)(bootstrapSecretsText, `Failed to get bootstrap secrets`);
    const bootstrapSecrets = JSON.parse(bootstrapSecretsText.toString());
    return bootstrapSecrets;
}
//# sourceMappingURL=validateAndAddSecrets.js.map