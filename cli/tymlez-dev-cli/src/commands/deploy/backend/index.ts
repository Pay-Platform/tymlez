import assert from 'assert';
import { STS } from 'aws-sdk';
import { deployViaTerraform } from './deployViaTerraform';
import { buildAndPushDockerImage } from './buildAndPushDockerImage';

const sts = new STS();

export async function deploy(repo: string) {
  assert(process.env.ENV, 'ENV is missing');
  assert(process.env.ENV !== 'local', 'Cannot deploy to "local"');
  assert(process.env.TF_TOKEN, 'TF_TOKEN is missing');
  assert(process.env.GIT_SHA, 'GIT_SHA is missing');
  assert(process.env.GIT_TAG, 'GIT_TAG is missing');
  assert(process.env.AWS_REGION, 'AWS_REGION is missing');
  assert(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');

  if (process.env.ENV !== 'local') {
    const { Arn: callerArn } = await sts.getCallerIdentity().promise();
    const fullEnv = `${process.env.CLIENT_NAME}-${process.env.ENV}`;
    assert(
      callerArn?.includes(`/ci-${fullEnv}`),
      `AWS caller: ${callerArn} not allow to deploy to ${fullEnv}`,
    );
  }

  const TF_WS_PREFIX = `${process.env.CLIENT_NAME}-`;

  await buildAndPushDockerImage({
    imageTag: process.env.GIT_SHA,
    region: process.env.AWS_REGION,
    env: process.env.ENV,
    repo,
  });

  await deployViaTerraform({
    gitSha: process.env.GIT_SHA,
    gitTag: process.env.GIT_TAG,
    tfToken: process.env.TF_TOKEN,
    workspaceName: `${TF_WS_PREFIX}${process.env.ENV}`,
  });
}
