import assert from 'assert';
import fs from 'fs';
import { template } from 'lodash';
import { getBuildTimeConfig } from './getBuildTimeConfig';

const { readFile, writeFile } = fs.promises;

export const loadEnv = async (): Promise<void> => {
  assert(process.env.ENV, 'ENV is missing');
  assert(process.env.CLIENT_NAME, 'CLIENT_NAME is missing');

  console.log(`--- Loading ENV for ${process.env.ENV}`);

  const {
    GUARDIAN_OPERATOR_ID,
    GUARDIAN_OPERATOR_KEY,
    GUARDIAN_TYMLEZ_API_KEY,
  } = await getBuildTimeConfig({
    env: process.env.ENV,
    clientName: process.env.CLIENT_NAME,
  });

  // console.log('Updating ./tymlez-service/.env.docker');
  // await updateTemplate({
  //   templateFile: './tymlez-service/.env.docker.template',
  //   data: {
  //     GUARDIAN_OPERATOR_ID,
  //     GUARDIAN_OPERATOR_KEY,
  //     GUARDIAN_TYMLEZ_API_KEY,
  //   },
  // });

  // console.log('Updating ./tymlez-service/.env');
  // await updateTemplate({
  //   templateFile: './tymlez-service/.env.template',
  //   data: {
  //     GUARDIAN_OPERATOR_ID,
  //     GUARDIAN_OPERATOR_KEY,
  //     GUARDIAN_TYMLEZ_API_KEY,
  //   },
  // });

  await updateTemplate({
    templateFile: '.env.template',
    data: {
      GUARDIAN_OPERATOR_ID,
      GUARDIAN_OPERATOR_KEY,
      GUARDIAN_TYMLEZ_API_KEY,
    },
  });
};

async function updateTemplate({
  templateFile,
  data,
}: {
  templateFile: string;
  data: any;
}) {
  const templateContent = await readFile(templateFile, 'utf-8');
  await writeFile(
    templateFile.replace('.template', ''),
    template(templateContent)(data),
  );
}
