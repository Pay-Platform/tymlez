import assert from 'assert';
import path from 'path';
import { getParameters } from '@tymlez/common-libs';
import type { IBootstrap, IUserDetail } from '@tymlez/backend-libs';

export const getBuildTimeConfig = async ({
  env,
  clientName,
}: {
  env: string;
  clientName: string;
}): Promise<IConfig> => {
  assert(
    env === 'local' || env === 'dev' || env === 'preprod' || env === 'prod',
    `Unsupported env: '${env}'.`,
  );

  const [METER_DB_HOST, METER_DB_PASSWORD, METER_INGESTION_FUNCTIONS_BUCKET] =
    env !== 'local'
      ? await getParameters([
          `/${env}/tymlez-platform/platform-questdb-host`,
          `/${env}/tymlez-platform/platform-questdb-password`,
          `/${env}/tymlez-platform/meter-ingestion-functions-bucket`,
        ])
      : ['127.0.0.1', 'test', undefined];

  assert(METER_DB_HOST, ` METER_DB_HOST is missing`);
  assert(METER_DB_PASSWORD, `METER_DB_PASSWORD missing`);

  const bootstrap =
    env === 'local' ? getLocalBootstrapWithSecrets({ clientName }) : undefined;

  return {
    METER_DB_PORT: '8812',
    METER_DB_DATABASE: 'qdb',
    METER_DB_USERNAME: 'admin',
    METER_DB_HOST,
    METER_DB_PASSWORD,
    BOOTSTRAP_DATA: bootstrap,
    METER_INGESTION_FUNCTIONS_BUCKET,
  };
};

function getLocalBootstrapWithSecrets({ clientName }: { clientName: string }) {
  const bootstrap = require(path.resolve(
    `../${clientName}-middleware/tools/lib/deploy/bootstrap.js`,
  )) as IBootstrap;

  Object.values(bootstrap.user_details).forEach((userDetail: IUserDetail) => {
    // eslint-disable-next-line no-param-reassign
    (userDetail as any).password = `${userDetail.email.split('@')[0]}1`;
  });
  return bootstrap;
}

export interface IConfig {
  METER_DB_PORT: string;
  METER_DB_DATABASE: string;
  METER_DB_USERNAME: string;
  METER_DB_HOST: string;
  METER_DB_PASSWORD: string;
  BOOTSTRAP_DATA?: IBootstrap;
  METER_INGESTION_FUNCTIONS_BUCKET?: string;
}
