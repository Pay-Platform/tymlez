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
const aws_sdk_1 = require("aws-sdk");
const uuid_1 = require("uuid");
const assert_1 = __importDefault(require("assert"));
const exec_sh_1 = require("exec-sh");
const getBuildTimeConfig_1 = require("./getBuildTimeConfig");
function deploy(env, clientName, dist, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, assert_1.default)(env, 'ENV is missing');
        (0, assert_1.default)(env !== 'local', 'Cannot deploy "local"');
        (0, assert_1.default)(clientName, 'ClientName is missing');
        console.log('Deploy front-end app from: %s', dist);
        const { CLOUDFRONT_DISTRIBUTION_ID } = yield (0, getBuildTimeConfig_1.getBuildTimeConfig)({
            env,
        });
        const target = `s3://${env}.${clientName}.tymlez.com/${folder}`;
        yield (0, exec_sh_1.promise)(['aws', 's3', 'sync', `--acl 'public-read'`, dist, target].join(' '));
        console.log('Deployed site to %s', target);
        (0, assert_1.default)(CLOUDFRONT_DISTRIBUTION_ID, `CLOUDFRONT_DISTRIBUTION_ID is missing`);
        yield invalidateCloudfront({ distributionId: CLOUDFRONT_DISTRIBUTION_ID });
    });
}
exports.deploy = deploy;
function invalidateCloudfront({ distributionId, }) {
    return __awaiter(this, void 0, void 0, function* () {
        const cloudFront = new aws_sdk_1.CloudFront();
        const invalidatingItems = ['/*'];
        console.log('Invalidating CloudFront %s', distributionId, invalidatingItems);
        yield cloudFront
            .createInvalidation({
            DistributionId: distributionId,
            InvalidationBatch: {
                CallerReference: (0, uuid_1.v4)(),
                Paths: {
                    Quantity: invalidatingItems.length,
                    Items: invalidatingItems,
                },
            },
        })
            .promise();
    });
}
//# sourceMappingURL=deploy.js.map