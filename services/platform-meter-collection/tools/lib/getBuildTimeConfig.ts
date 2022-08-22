import assert from 'assert';
import { getParameters } from '@tymlez/common-libs';
import path from 'path';
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

  const [
    METER_COLLECTION_FUNCTIONS_BUCKET,
    METER_DB_HOST,
    METER_DB_PASSWORD,
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    GUARDIAN_TYMLEZ_SERVICE_API_KEY,
  ] =
    env !== 'local'
      ? await getParameters([
          `/${env}/tymlez-platform/meter-collection-functions-bucket`,
          `/${env}/tymlez-platform/platform-questdb-host`,
          `/${env}/tymlez-platform/platform-questdb-password`,
          `/${env}/tymlez-platform/guardian-tymlez-service-base-url`,
          `/${env}/tymlez-platform/guardian-tymlez-service-api-key`,
        ])
      : [
          undefined,
          '127.0.0.1',
          'test',
          'http://localhost:3010',
          'tymlezApiKey1',
        ];

  assert(METER_DB_HOST, ` METER_DB_HOST is missing`);
  assert(METER_DB_PASSWORD, `METER_DB_PASSWORD missing`);

  return {
    METER_COLLECTION_FUNCTIONS_BUCKET,
    BOOTSTRAP_DATA:
      env === 'local'
        ? getLocalBootstrapWithSecrets({ clientName })
        : undefined,
    METER_DB_PORT: '8812',
    METER_DB_DATABASE: 'qdb',
    METER_DB_USERNAME: 'admin',
    METER_DB_HOST,
    METER_DB_PASSWORD,
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL,
    GUARDIAN_TYMLEZ_SERVICE_API_KEY,
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

interface IConfig {
  METER_COLLECTION_FUNCTIONS_BUCKET?: string;
  BOOTSTRAP_DATA: IBootstrap | undefined;
  METER_DB_PORT: string;
  METER_DB_DATABASE: string;
  METER_DB_USERNAME: string;
  METER_DB_HOST: string;
  METER_DB_PASSWORD: string;
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL?: string;
  GUARDIAN_TYMLEZ_SERVICE_API_KEY?: string;
}
