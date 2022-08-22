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
exports.buildAndPushDockerImage = void 0;
const common_libs_1 = require("@tymlez/common-libs");
const aws_sdk_1 = require("aws-sdk");
const exec_sh_1 = require("exec-sh");
const sts = new aws_sdk_1.STS();
function buildAndPushDockerImage({ imageTag, region, env, repo, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const { Account: accountId } = yield sts.getCallerIdentity().promise();
        const ecrRegistry = `${accountId}.dkr.ecr.${region}.amazonaws.com`;
        yield (0, common_libs_1.loginToEcr)({ ecrRegistry, region });
        const ecrRepository = `${env}-${repo}-middleware`;
        console.log('ecrRepository', ecrRepository);
        yield (0, exec_sh_1.promise)([
            'tsc',
            '--showConfig',
            '|',
            "jq 'del(.files)'",
            '>',
            'tsconfig.json.out',
        ].join(' '));
        yield (0, common_libs_1.buildDockerImage)({
            ecrRegistry,
            ecrRepository,
            imageTag,
            context: '../..',
        });
        yield (0, common_libs_1.pushDockerImageToEcr)({ ecrRegistry, ecrRepository, imageTag });
        const xrayEcrRepository = `${env}-aws-xray-daemon`;
        yield (0, exec_sh_1.promise)(['docker', 'pull', 'amazon/aws-xray-daemon:latest'].join(' '));
        yield (0, exec_sh_1.promise)([
            'docker',
            'tag',
            'amazon/aws-xray-daemon:latest',
            `${ecrRegistry}/${xrayEcrRepository}:latest`,
        ].join(' '));
        yield (0, common_libs_1.pushDockerImageToEcr)({
            ecrRegistry,
            ecrRepository: xrayEcrRepository,
            imageTag: 'latest',
        });
    });
}
exports.buildAndPushDockerImage = buildAndPushDockerImage;
//# sourceMappingURL=buildAndPushDockerImage.js.map