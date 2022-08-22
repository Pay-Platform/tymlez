/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */

import path from 'path';
import fs from 'fs';
import { S3, STS } from 'aws-sdk';
import deepmerge from 'deepmerge';
import assert from 'assert';
import md5 from 'md5';
import { logger, validateBootstrap } from '@tymlez/backend-libs';
import type { IBootstrap, IBootstrapSecrets } from '@tymlez/backend-libs';

const { readFile, writeFile } = fs.promises;
const s3 = new S3();
const sts = new STS();

async function handler({
  bootstrapFilePath,
  secretsFilePath,
}: {
  bootstrapFilePath: string;
  secretsFilePath: string;
}) {
  assert(process.env.ENV, `ENV is missing`);
  assert(process.env.ENV !== 'local', `Cannot put secrets when ENV is 'local'`);
  assert(process.env.CLIENT_NAME, `CLIENT_NAME is missing`);

  const bootstrap: IBootstrap = require(path.resolve(bootstrapFilePath));
  assert(
    bootstrap.client_detail.name === process.env.CLIENT_NAME,
    `Client name in bootstrap is '${bootstrap.client_detail.name}', expect '${process.env.CLIENT_NAME}'`,
  );

  if (process.env.ENV !== 'local') {
    const { Arn: callerArn } = await sts.getCallerIdentity().promise();
    const fullEnv = `${process.env.CLIENT_NAME}-${process.env.ENV}`;
    assert(
      callerArn?.includes(`/ci-${fullEnv}`),
      `AWS caller: ${callerArn} not allow to deploy to ${fullEnv}`,
    );
  }

  const bootstrapSecrets: IBootstrapSecrets = require(path.resolve(
    secretsFilePath,
  ));

  const bootstrapWithSecrets = deepmerge(bootstrap, bootstrapSecrets);

  await validateBootstrap({
    bootstrap: bootstrapWithSecrets,
    allowSecret: true,
  });

  const bootstrapSecretsText = JSON.stringify(bootstrapSecrets);
  const bootstrapSecretsMd5 = await md5(bootstrapSecretsText);
  const secretsBinary = Buffer.from(bootstrapSecretsText, 'binary');

  await s3
    .putObject({
      Bucket: `${process.env.ENV}-${process.env.CLIENT_NAME}-tymlez-client-data`,
      Key: `secrets/bootstrap-secrets-${process.env.ENV}-${bootstrapSecretsMd5}.json`,
      Body: secretsBinary,
    })
    .promise();

  const bootstrapContent = await readFile(bootstrapFilePath, 'utf-8');

  const newBootstrapContent = bootstrapContent.replace(
    /secrets_hash: '[^']+'/,
    `secrets_hash: '${bootstrapSecretsMd5}'`,
  );

  await writeFile(bootstrapFilePath, newBootstrapContent);

  logger.info(
    `Updated secrets and saved its has (${bootstrapSecretsMd5}) in bootstrap.`,
  );
}

const command = 'put-secrets [bootstrapFilePath] [secretsFilePath]';
const desc =
  'Put secrets to AWS S3 and update the version ID in bootstrap file';
const builder = {
  bootstrapFilePath: {
    aliases: ['bootstrapFilePath'],
    type: 'string',
    required: true,
    desc: 'Path to the bootstrap file',
  },
  secretsFilePath: {
    aliases: ['secretsFilePath'],
    type: 'string',
    required: true,
    desc: 'Path to the bootstrap secrets file',
  },
};

export { command, desc, handler, builder };
