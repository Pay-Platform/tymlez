import { STS } from 'aws-sdk';
import {
  buildDockerImage,
  loginToEcr,
  pushDockerImageToEcr,
} from '@tymlez/common-libs';

const sts = new STS();

export async function buildAndPushDockerImage({
  imageTag,
  region,
  env,
}: {
  imageTag: string;
  region: string;
  env: string;
}) {
  const { Account: accountId } = await sts.getCallerIdentity().promise();

  const ecrRegistry = `${accountId}.dkr.ecr.${region}.amazonaws.com`;

  await loginToEcr({ ecrRegistry, region });

  const ecrRepository = `${env}-client-middleware`;

  await buildDockerImage({ ecrRegistry, ecrRepository, imageTag });
  await pushDockerImageToEcr({ ecrRegistry, ecrRepository, imageTag });
}
