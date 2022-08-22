import { STS } from 'aws-sdk';
import {
  buildDockerImage,
  loginToEcr,
  pushDockerImageToEcr,
} from '@tymlez/common-libs';

export async function buildAndPushDockerImage({
  imageTag,
  region,
  env,
  context = '.',
}: {
  imageTag: string;
  region: string;
  env: string;
  context: string;
}) {
  const sts = new STS();
  const { Account: accountId } = await sts.getCallerIdentity().promise();

  const ecrRegistry = `${accountId}.dkr.ecr.${region}.amazonaws.com`;

  await loginToEcr({ ecrRegistry, region });

  const ecrRepository = `${env}-client-middleware`;

  await buildDockerImage({
    ecrRegistry,
    ecrRepository,
    imageTag,
    context,
  });
  await pushDockerImageToEcr({ ecrRegistry, ecrRepository, imageTag });
}
