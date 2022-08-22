import assert from 'assert';
import { getParameters } from '@tymlez/common-libs';

export const getBuildTimeConfig = async ({
  env,
}: {
  env: string;
}): Promise<IConfig> => {
  assert(
    env === 'local' || env === 'dev' || env === 'preprod' || env === 'prod',
    `Unsupported env: '${env}'.`,
  );

  const [CLOUDFRONT_DISTRIBUTION_ID] =
    env !== 'local'
      ? await getParameters([
          `/${env}/tymlez-platform/fe-cloudfront-distribution-id`,
        ])
      : [process.env.CLOUDFRONT_DISTRIBUTION_ID];

  const defaultConfig = DEFAULT_CONFIGS[env];

  const PLATFORM_API_ORIGIN = defaultConfig?.PLATFORM_API_ORIGIN ?? '';
  const UON_API_ORIGIN = defaultConfig?.UON_API_ORIGIN ?? '';

  return {
    ...defaultConfig,
    CLOUDFRONT_DISTRIBUTION_ID,
    ENV: env,
    GIT_SHA: process.env.GIT_SHA,

    PLATFORM_API_ORIGIN,
    PLATFORM_API_URL: `${PLATFORM_API_ORIGIN}/api`,
    UON_API_ORIGIN,
    UON_API_URL: `${UON_API_ORIGIN}/client-api`,
  };
};

const DEFAULT_CONFIGS: Record<string, Partial<IConfig> | undefined> = {
  local: {
    PLATFORM_API_ORIGIN: 'http://localhost:8080',
    UON_API_ORIGIN: 'http://localhost:8082',
    // PLATFORM_API_ORIGIN: 'https://dev.uon.tymlez.com',
    // UON_API_ORIGIN: 'https://dev.uon.tymlez.com',
    // OK to keep "secrets" for `local` ENV, but not for other ENV
    LOGIN_EMAIL: 'admin@uon.com',
    LOGIN_PASSWORD: 'admin1',
  },
};

interface IConfig {
  ENV: string;
  GIT_SHA?: string;
  CLOUDFRONT_DISTRIBUTION_ID?: string;
  PLATFORM_API_ORIGIN: string;
  PLATFORM_API_URL: string;
  UON_API_ORIGIN: string;
  UON_API_URL: string;
  LOGIN_EMAIL?: string;
  LOGIN_PASSWORD?: string;
}
