"use strict";
/* eslint-disable no-process-env */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeFileToS3 = void 0;
const aws_sdk_1 = require("aws-sdk");
const path_1 = __importDefault(require("path"));
const pino_1 = require("../pino");
__exportStar(require("./IStoreFile"), exports);
const getS3Client = () => {
    const s3Endpoint = process.env.S3_ENDPOINT || 'http://localhost:4566';
    const localS3Config = process.env.ENV === 'local'
        ? {
            endpoint: new aws_sdk_1.Endpoint(s3Endpoint),
            s3ForcePathStyle: true,
            accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
        }
        : {};
    return new aws_sdk_1.S3({
        region: 'ap-southeast-2',
        ...localS3Config,
    });
};
async function ensureS3Bucket(bucketName, s3) {
    try {
        const buckets = await s3.listBuckets().promise();
        if (buckets.Buckets?.find((b) => b.Name === bucketName)) {
            return true;
        }
        await s3.createBucket({ Bucket: bucketName }).promise();
        return true;
    }
    catch (error) {
        pino_1.logger.error({ error }, 'Cannot create bucket');
        return false;
    }
}
async function storeFileToS3(bucketName, filename, content) {
    const s3 = getS3Client();
    await ensureS3Bucket(bucketName, s3);
    const putObjectResult = await s3
        .upload({ Bucket: bucketName, Body: content, Key: filename })
        .promise();
    return {
        name: path_1.default.basename(filename),
        url: putObjectResult.Location,
    };
}
exports.storeFileToS3 = storeFileToS3;
//# sourceMappingURL=index.js.map