import assert from 'assert';
import fs from 'fs';
import { getBuildTimeConfig } from './getBuildTimeConfig';

const { writeFile } = fs.promises;

export const loadEnv = async (): Promise<void> => {
  assert(process.env.ENV, 'ENV is missing');
  assert(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');

  const { BOOTSTRAP_DATA, ...buildTimeConfig } = await getBuildTimeConfig({
    env: process.env.ENV,
    clientName: process.env.CLIENT_NAME,
  });

  const envMap = {
    TZ: 'UTC',
    ...buildTimeConfig,
    BOOTSTRAP_DATA: JSON.stringify(BOOTSTRAP_DATA),
  };

  console.log(`--- Loading ENV for ${process.env.ENV}`, envMap);
  await writeFile(
    './.env',
    [
      '# Auto generated by tools/lib/environment.ts, DO NOT modify manually.\n',
      ...Object.entries(envMap)
        .filter(([_key, value]) => !!value)
        .map(([key, value]) => `${key}='${value}'`),
    ].join('\n'),
  );
};
