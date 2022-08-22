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
exports.deploy = void 0;
const assert_1 = __importDefault(require("assert"));
const aws_sdk_1 = require("aws-sdk");
const deployViaTerraform_1 = require("./deployViaTerraform");
const buildAndPushDockerImage_1 = require("./buildAndPushDockerImage");
const sts = new aws_sdk_1.STS();
function deploy(repo) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(process.env.ENV, 'ENV is missing');
        (0, assert_1.default)(process.env.ENV !== 'local', 'Cannot deploy to "local"');
        (0, assert_1.default)(process.env.TF_TOKEN, 'TF_TOKEN is missing');
        (0, assert_1.default)(process.env.GIT_SHA, 'GIT_SHA is missing');
        (0, assert_1.default)(process.env.GIT_TAG, 'GIT_TAG is missing');
        (0, assert_1.default)(process.env.AWS_REGION, 'AWS_REGION is missing');
        (0, assert_1.default)(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');
        if (process.env.ENV !== 'local') {
            const { Arn: callerArn } = yield sts.getCallerIdentity().promise();
            const fullEnv = `${process.env.CLIENT_NAME}-${process.env.ENV}`;
            (0, assert_1.default)(callerArn === null || callerArn === void 0 ? void 0 : callerArn.includes(`/ci-${fullEnv}`), `AWS caller: ${callerArn} not allow to deploy to ${fullEnv}`);
        }
        const TF_WS_PREFIX = `${process.env.CLIENT_NAME}-`;
        yield (0, buildAndPushDockerImage_1.buildAndPushDockerImage)({
            imageTag: process.env.GIT_SHA,
            region: process.env.AWS_REGION,
            env: process.env.ENV,
            repo,
        });
        yield (0, deployViaTerraform_1.deployViaTerraform)({
            gitSha: process.env.GIT_SHA,
            gitTag: process.env.GIT_TAG,
            tfToken: process.env.TF_TOKEN,
            workspaceName: `${TF_WS_PREFIX}${process.env.ENV}`,
        });
    });
}
exports.deploy = deploy;
//# sourceMappingURL=index.js.map