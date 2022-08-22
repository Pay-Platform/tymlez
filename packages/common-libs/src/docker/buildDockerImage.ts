import { promise as exec } from 'exec-sh';

export async function buildDockerImage({
  ecrRegistry,
  ecrRepository,
  imageTag,
  context = '.',
  dockerFile = 'Dockerfile',
}: {
  ecrRegistry: string;
  ecrRepository: string;
  imageTag: string;
  context?: string;
  dockerFile?: string;
}) {
  const command = [
    'docker',
    'build',
    '-t',
    `${ecrRegistry}/${ecrRepository}`,
    '--build-arg',
    `GIT_SHA=${imageTag}`,
    '--progress=plain',
    '-f',
    dockerFile,
    context,
  ].join(' ');
  console.log('exec command', command);
  await exec(command);
}
