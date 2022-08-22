import { promise as exec } from 'exec-sh';

export async function loginToEcr({
  ecrRegistry,
  region,
}: {
  ecrRegistry: string;
  region: string;
}) {
  await exec(
    [
      'aws',
      'ecr',
      'get-login-password',
      `--region ${region}`,
      '|',
      'docker',
      'login',
      '--username AWS',
      `--password-stdin ${ecrRegistry}`,
    ].join(' '),
  );
}
