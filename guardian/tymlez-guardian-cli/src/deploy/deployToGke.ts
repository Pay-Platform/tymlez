import { promise as exec } from 'exec-sh';
import { resolve } from 'path';

export async function deployToGke({
  clientName,
  env,
  gcpProjectId,
  gkeCluster,
  region,
  imageTag,
  apiKey,
}: {
  clientName: string;
  env: string;
  gcpProjectId: string;
  gkeCluster: string;
  region: string;
  imageTag: string;
  apiKey: string;
}) {
  // Make sure w don't deploy to the wrong GCP project
  const fullEnv = `${clientName}-${env}`;
  await exec(
    [
      'gcloud',
      'config',
      'get-value',
      'project',
      '|',
      'grep',
      fullEnv,
      '||',
      `{ echo Invalid GCP project, expect ${fullEnv}; false; }`,
    ].join(' '),
  );

  console.log('Using GKE Cluster', { gkeCluster, region });

  await exec(['helm', 'version'].join(' '));

  await exec(
    [
      'gcloud',
      'container',
      'clusters',
      'get-credentials',
      gkeCluster,
      '--region',
      region,
    ].join(' '),
  );
  console.log(
    'Charts location',
    __dirname,
    resolve(__dirname, 'charts/guardian-tymlez-service'),
  );
  await exec(['helm', 'dependency', 'update'].join(' '), {
    cwd: resolve(__dirname, 'charts/guardian-tymlez-service'),
  });

  await exec(
    [
      'helm',
      'upgrade',
      '--install',
      '--debug',
      `tymlez-guardian-${process.env.ENV}`,
      '.',
      `--set-string image.repository="asia.gcr.io/${gcpProjectId}/guardian-tymlez-service"`,
      `--set-string image.tag="${imageTag}"`,
      `--set-string configmap.data.DEPLOY_VERSION="${imageTag}"`,
      `--set-string configmap.data.GUARDIAN_TYMLEZ_API_KEY="${apiKey}"`,

      // '--dry-run',
    ].join(' '),
    {
      cwd: resolve(__dirname, 'charts/guardian-tymlez-service'),
    },
  );
}
