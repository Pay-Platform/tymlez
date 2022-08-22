import { promise as exec } from 'exec-sh';

export async function pushDockerImageToEcr({
  ecrRegistry,
  ecrRepository,
  imageTag,
}: {
  ecrRegistry: string;
  ecrRepository: string;
  imageTag: string;
}) {
  await exec(
    ['docker', 'push', `${ecrRegistry}/${ecrRepository}:latest`].join(' '),
  );

  if (imageTag !== 'latest') {
    await exec(
      [
        'docker',
        'tag',
        `${ecrRegistry}/${ecrRepository}:latest`,
        `${ecrRegistry}/${ecrRepository}:${imageTag}`,
      ].join(' '),
    );

    await exec(
      ['docker', 'push', `${ecrRegistry}/${ecrRepository}:${imageTag}`].join(
        ' ',
      ),
    );
  }
}
