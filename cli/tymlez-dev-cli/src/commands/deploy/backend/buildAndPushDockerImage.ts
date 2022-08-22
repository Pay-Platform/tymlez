import {
  buildDockerImage,
  loginToEcr,
  pushDockerImageToEcr,
} from '@tymlez/common-libs';
import { STS } from 'aws-sdk';
import { promise as exec } from 'exec-sh';

const sts = new STS();

export async function buildAndPushDockerImage({
  imageTag,
  region,
  env,
  repo,
}: {
  imageTag: string;
  region: string;
  env: string;
  repo: string;
}) {
  const { Account: accountId } = await sts.getCallerIdentity().promise();

  const ecrRegistry = `${accountId}.dkr.ecr.${region}.amazonaws.com`;

  await loginToEcr({ ecrRegistry, region });

  const ecrRepository = `${env}-${repo}-middleware`;
  console.log('ecrRepository', ecrRepository);
  await exec(
    [
      'tsc',
      '--showConfig',
      '|',
      "jq 'del(.files)'",
      '>',
      'tsconfig.json.out',
    ].join(' '),
  );

  await buildDockerImage({
    ecrRegistry,
    ecrRepository,
    imageTag,
    context: '../..',
  });
  await pushDockerImageToEcr({ ecrRegistry, ecrRepository, imageTag });

  const xrayEcrRepository = `${env}-aws-xray-daemon`;
  await exec(['docker', 'pull', 'amazon/aws-xray-daemon:latest'].join(' '));
  await exec(
    [
      'docker',
      'tag',
      'amazon/aws-xray-daemon:latest',
      `${ecrRegistry}/${xrayEcrRepository}:latest`,
    ].join(' '),
  );
  await pushDockerImageToEcr({
    ecrRegistry,
    ecrRepository: xrayEcrRepository,
    imageTag: 'latest',
  });
}
