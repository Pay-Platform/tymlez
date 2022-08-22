'use strict';

import deepFreeze from 'deep-freeze-strict';
import assert from 'assert';
import { S3 } from 'aws-sdk';
import deepmerge from 'deepmerge';
import { validateBootstrap } from './validateBootstrap';
import type { IBootstrapSecrets } from './interfaces/IBootstrapSecrets';
import type { IBootstrap } from './interfaces/IBootstrap';

const s3 = new S3();

export async function validateAndAddSecrets({
  env,
  clientName,
  bootstrap,
}: {
  env: string;
  clientName: string;
  bootstrap: IBootstrap;
}) {
  deepFreeze(bootstrap);

  await validateBootstrap({ bootstrap });

  const bootstrapSecrets = await fetchBootstrapSecretsFromS3(
    bootstrap,
    env,
    clientName,
  );

  const bootstrapWithSecrets = deepmerge(bootstrap, bootstrapSecrets);

  await validateBootstrap({
    bootstrap: bootstrapWithSecrets,
    allowSecret: true,
  });

  return bootstrapWithSecrets;
}

async function fetchBootstrapSecretsFromS3(
  bootstrap: IBootstrap,
  env: string,
  clientName: string,
) {
  assert(bootstrap.secrets_hash, `bootstrap.secrets_hash is missing`);

  console.log(
    'fetching booostrap secrets from s3',
    `secrets/bootstrap-secrets-${env}-${bootstrap.secrets_hash}.json`,
  );
  const { Body: bootstrapSecretsText } = await s3
    .getObject({
      Bucket: `${env}-${clientName}-tymlez-client-data`,
      Key: `secrets/bootstrap-secrets-${env}-${bootstrap.secrets_hash}.json`,
    })
    .promise();
  assert(bootstrapSecretsText, `Failed to get bootstrap secrets`);

  const bootstrapSecrets = JSON.parse(
    bootstrapSecretsText.toString(),
  ) as IBootstrapSecrets;

  return bootstrapSecrets;
}
