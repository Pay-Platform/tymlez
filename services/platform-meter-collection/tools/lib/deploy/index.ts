import assert from 'assert';
import { STS } from 'aws-sdk';
import { promise as exec } from 'exec-sh';
import { logger } from '@tymlez/backend-libs';
import md5File from 'md5-file';
import { deployViaTerraform } from './deployViaTerraform';
import { getBuildTimeConfig } from '../getBuildTimeConfig';

const sts = new STS();

export async function deploy() {
  assert(process.env.ENV, 'ENV is missing');
  assert(process.env.ENV !== 'local', 'Cannot deploy to "local"');
  assert(process.env.TF_TOKEN, 'TF_TOKEN is missing');
  assert(process.env.GIT_SHA, 'GIT_SHA is missing');
  assert(process.env.GIT_TAG, 'GIT_TAG is missing');
  assert(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');

  if (process.env.ENV !== 'local') {
    const { Arn: callerArn } = await sts.getCallerIdentity().promise();
    const fullEnv = `${process.env.CLIENT_NAME}-${process.env.ENV}`;
    assert(
      callerArn?.includes(`/ci-${fullEnv}`),
      `AWS caller: ${callerArn} not allow to deploy to ${fullEnv}`,
    );
  }

  const { METER_COLLECTION_FUNCTIONS_BUCKET } = await getBuildTimeConfig({
    env: process.env.ENV,
    clientName: process.env.CLIENT_NAME,
  });
  assert(
    METER_COLLECTION_FUNCTIONS_BUCKET,
    `METER_COLLECTION_FUNCTIONS_BUCKET is missing`,
  );

  const TF_WS_PREFIX = `${process.env.CLIENT_NAME}-`;

  logger.info('Packaging...');
  await exec(['serverless', 'package'].join(' '));

  const packagedFile = './.serverless/platform-meter-collection.zip';
  const packagedFileMd5 = await md5File(packagedFile);
  const functionsObject = `platform-meter-collection-${packagedFileMd5}.zip`;

  logger.info(
    `Uploading '${functionsObject}' to Cloud Storage: '${METER_COLLECTION_FUNCTIONS_BUCKET}'...`,
  );

  await exec(
    [
      'aws',
      's3',
      'cp',
      packagedFile,
      `s3://${METER_COLLECTION_FUNCTIONS_BUCKET}/${functionsObject}`,
    ].join(' '),
  );

  await deployViaTerraform({
    gitSha: process.env.GIT_SHA,
    gitTag: process.env.GIT_TAG,
    tfToken: process.env.TF_TOKEN,
    workspaceName: `${TF_WS_PREFIX}${process.env.ENV}`,
    functionsObject,
  });
}
