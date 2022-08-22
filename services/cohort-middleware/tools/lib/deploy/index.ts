import assert from 'assert';
import { STS } from 'aws-sdk';
import { deployViaTerraform } from './deployViaTerraform';
import { buildAndPushDockerImage } from './buildAndPushDockerImage';

const sts = new STS();
const CLIENT_NAME = 'cohort';
const TF_WS_PREFIX = `${CLIENT_NAME}-`;

export async function deploy() {
  assert(process.env.ENV, 'ENV is missing');
  assert(process.env.ENV !== 'local', 'Cannot deploy to "local"');
  assert(process.env.TF_TOKEN, 'TF_TOKEN is missing');
  assert(process.env.GIT_SHA, 'GIT_SHA is missing');
  assert(process.env.GIT_TAG, 'GIT_TAG is missing');
  assert(process.env.AWS_REGION, 'AWS_REGION is missing');
  assert(process.env.CLIENT_NAME, `CLIENT_NAME is missing`);
  assert(
    process.env.CLIENT_NAME === CLIENT_NAME,
    `Unexpected CLIENT_NAME: ${process.env.CLIENT_NAME}, expect ${CLIENT_NAME}`,
  );

  if (process.env.ENV !== 'local') {
    const { Arn: callerArn } = await sts.getCallerIdentity().promise();
    const fullEnv = `${process.env.CLIENT_NAME}-${process.env.ENV}`;
    assert(
      callerArn?.includes(`/ci-${fullEnv}`),
      `AWS caller: ${callerArn} not allow to deploy to ${fullEnv}`,
    );
  }

  await buildAndPushDockerImage({
    imageTag: process.env.GIT_SHA,
    region: process.env.AWS_REGION,
    env: process.env.ENV,
  });

  await deployViaTerraform({
    env: process.env.ENV,
    gitSha: process.env.GIT_SHA,
    gitTag: process.env.GIT_TAG,
    tfToken: process.env.TF_TOKEN,
    clientName: CLIENT_NAME,
    workspaceName: `${TF_WS_PREFIX}${process.env.ENV}`,
  });
}
