import type { IBootstrap, IUserDetail } from '@tymlez/backend-libs';
import assert from 'assert';
import path from 'path';

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
  assert(clientName, 'clientName is missing');

  const fullEnv = env === 'local' ? 'local' : `${clientName}-${env}`;

  if (!CONFIGS[fullEnv]) {
    console.log(`Warn: Config for '${fullEnv}' does not exist`);
  }

  if (env !== 'local') {
    return {
      ...CONFIGS[fullEnv],
      ENV: env,
      BOOTSTRAP_DATA: process.env.BOOTSTRAP_DATA
        ? (JSON.parse(process.env.BOOTSTRAP_DATA) as IBootstrap)
        : undefined,
      SALT_ROUNDS: process.env.SALT_ROUNDS
        ? parseInt(process.env.SALT_ROUNDS, 10)
        : undefined,
      CLIENT_NAME: clientName,
    };
  }

  const bootstrap = getLocalBootstrapWithSecrets({
    clientName,
  });

  return {
    ENV: env,
    PORT: '8080',
    JWT_SECRET: 'secret',
    JWT_EXPIRES_IN: '12h',
    SALT_ROUNDS: 13,

    DATABASE_USERNAME: 'test',
    DATABASE_PASSWORD: 'test',
    DATABASE_NAME: 'test',
    DATABASE_TYPE: 'postgresql',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',

    REDIS_CONNECTION: 'redis://localhost:6379',

    CACHE_TTL: '10',

    METER_DB_HOST: 'localhost',
    METER_DB_USERNAME: 'admin',
    METER_DB_PASSWORD: 'test',
    BOOTSTRAP_DATA: bootstrap as IBootstrap,
    CLIENT_NAME: clientName,
    GUARDIAN_TYMLEZ_SERVICE_BASE_URL: 'http://localhost:3010',
    GUARDIAN_TYMLEZ_SERVICE_API_KEY: 'tymlezApiKey1',
  };
};

const CONFIGS: Record<string, Partial<IConfig>> = {
  local: {
    API_BASE_URL: 'http://localhost:8080/api',
  },
  'cohort-dev': {
    API_BASE_URL: 'https://dev.cohort.tymlez.com/api',
  },
  'cohort-preprod': {
    API_BASE_URL: 'https://preprod.cohort.tymlez.com/api',
  },
  'cohort-prod': {
    API_BASE_URL: 'https://prod.cohort.tymlez.com/api',
  },
  'tymlez-dev': {
    API_BASE_URL: 'https://dev.platform.tymlez.com/api',
  },
  'tymlez-prod': {
    API_BASE_URL: 'https://prod.platform.tymlez.com/api',
  },
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
  ENV: string;
  API_BASE_URL?: string;
  BOOTSTRAP_DATA?: IBootstrap;
  SALT_ROUNDS?: number;

  PORT?: string;
  JWT_SECRET?: string;
  JWT_EXPIRES_IN?: string;
  DATABASE_USERNAME?: string;
  DATABASE_PASSWORD?: string;
  DATABASE_NAME?: string;
  DATABASE_TYPE?: string;
  DATABASE_URL?: string;
  REDIS_CONNECTION?: string;
  CACHE_TTL?: string;
  METER_DB_HOST?: string;
  METER_DB_USERNAME?: string;
  METER_DB_PASSWORD?: string;
  CLIENT_NAME?: string;
  GUARDIAN_TYMLEZ_SERVICE_BASE_URL?: string;
  GUARDIAN_TYMLEZ_SERVICE_API_KEY?: string;
}
