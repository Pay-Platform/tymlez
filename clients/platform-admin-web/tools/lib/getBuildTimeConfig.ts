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
  const COHORT_API_ORIGIN = defaultConfig?.COHORT_API_ORIGIN ?? '';

  return {
    ...defaultConfig,
    CLOUDFRONT_DISTRIBUTION_ID,
    ENV: env,
    GIT_SHA: process.env.GIT_SHA,

    PLATFORM_API_ORIGIN,
    PLATFORM_API_URL: `${PLATFORM_API_ORIGIN}/api`,
    COHORT_API_ORIGIN,
    COHORT_API_URL: `${COHORT_API_ORIGIN}/client-api`,
  };
};

const DEFAULT_CONFIGS: Record<string, Partial<IConfig> | undefined> = {
  local: {
    PLATFORM_API_ORIGIN: 'http://localhost:8080',
    COHORT_API_ORIGIN: 'http://localhost:8082',
    // OK to keep "secrets" for `local` ENV, but not for other ENV
    LOGIN_EMAIL: 'admin@cohort.com',
    LOGIN_PASSWORD: 'admin1',
  },
};

interface IConfig {
  ENV: string;
  GIT_SHA?: string;
  CLOUDFRONT_DISTRIBUTION_ID?: string;
  PLATFORM_API_ORIGIN: string;
  PLATFORM_API_URL: string;
  COHORT_API_ORIGIN: string;
  COHORT_API_URL: string;
  LOGIN_EMAIL?: string;
  LOGIN_PASSWORD?: string;
}
