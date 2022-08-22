/* eslint-disable no-process-env */

import { Endpoint, S3 } from 'aws-sdk';
import path from 'path';
import { logger } from '../pino';
import type { IStoredFile } from './IStoreFile';

export * from './IStoreFile';

const localS3Config =
  process.env.ENV === 'local'
    ? {
        endpoint: new Endpoint('http://localhost:4566'), // This is the localstack EDGE_PORT
        s3ForcePathStyle: true,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'local',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'local',
      }
    : {};

const s3 = new S3({
  region: 'ap-southeast-2',
  ...localS3Config,
});

export async function ensureBucket(bucketName: string) {
  try {
    const buckets = await s3.listBuckets().promise();
    if (buckets.Buckets?.find((b) => b.Name === bucketName)) {
      return true;
    }
    await s3.createBucket({ Bucket: bucketName }).promise();
    return true;
  } catch (error) {
    logger.error({ error }, 'Cannot create bucket');
    return false;
  }
}
export async function storeFile(
  filename: string,
  content: Buffer,
): Promise<IStoredFile> {
  const bucketName = process.env.STORE_BUCKET_NAME || 'local';
  const key = `${process.env.STORE_KEY_PREFIX}/${filename}`;
  await ensureBucket(bucketName);
  const putObjectResult = await s3
    .upload({ Bucket: bucketName, Body: content, Key: key })
    .promise();
  return {
    name: path.basename(filename),
    url: putObjectResult.Location,
  };
}
