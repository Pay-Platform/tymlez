import assert from 'assert';
import { promise as exec } from 'exec-sh';
import md5File from 'md5-file';
import { Storage } from '@google-cloud/storage';
import { STS } from 'aws-sdk';
import { logger } from '@tymlez/backend-libs';
import { deployViaTerraform } from './deployViaTerraform';
import { getBuildTimeConfig } from '../getBuildTimeConfig';

const storage = new Storage();
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

  const { METER_INGESTION_FUNCTIONS_BUCKET } = await getBuildTimeConfig({
    env: process.env.ENV,
    clientName: process.env.CLIENT_NAME,
  });
  assert(
    METER_INGESTION_FUNCTIONS_BUCKET,
    `METER_INGESTION_FUNCTIONS_BUCKET is missing`,
  );

  const TF_WS_PREFIX = `${process.env.CLIENT_NAME}-`;

  logger.info('Packaging...');
  await exec(['serverless', 'package'].join(' '));

  const packagedFile = './.serverless/platform-meter-ingestion.zip';
  const packagedFileMd5 = await md5File(packagedFile);
  const functionsObject = `platform-meter-ingestion-${packagedFileMd5}.zip`;

  logger.info(
    `Uploading '${functionsObject}' to Cloud Storage: '${METER_INGESTION_FUNCTIONS_BUCKET}'...`,
  );
  await storage.bucket(METER_INGESTION_FUNCTIONS_BUCKET).upload(packagedFile, {
    destination: functionsObject,
  });

  await deployViaTerraform({
    gitSha: process.env.GIT_SHA,
    gitTag: process.env.GIT_TAG,
    tfToken: process.env.TF_TOKEN,
    workspaceName: `${TF_WS_PREFIX}${process.env.ENV}`,
    functionsObject,
  });
}
