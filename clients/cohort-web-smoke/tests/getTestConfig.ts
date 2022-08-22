import assert from 'assert';

export const getTestConfig = () => {
  assert(process.env.ENV, `process.env.ENV is missing`);

  return {
    ...(configs[process.env.ENV] ?? configs.dev),
    ENV: process.env.ENV,
  };
};

const configs: Record<string, ITestConfig> = {
  local: {
    WEB_BASE_URL: 'http://localhost:3000',
  },
  dev: {
    WEB_BASE_URL: 'https://dev.cohort.tymlez.com',
  },
  preprod: {
    WEB_BASE_URL: 'https://preprod.cohort.tymlez.com',
  },
  prod: {
    WEB_BASE_URL: 'https://prod.cohort.tymlez.com',
  },
};

interface ITestConfig {
  WEB_BASE_URL: string;
}
