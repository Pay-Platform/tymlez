import pLimit from 'p-limit';
import fs from 'fs';
import { zip } from 'lodash';
import { matchAll } from '@tymlez/common-libs';
import { getInterfaceFiles } from './getInterfaceFiles';

const { readFile } = fs.promises;

export async function checkDateType(inputPath?: string) {
  const tsFiles = (await getInterfaceFiles(inputPath)).filter(
    (file) => !file.includes('src/demo'),
  );
  await checkTimestampType(tsFiles);
  await checkTimeSpanType(tsFiles);

  console.log(
    'Pass: All usages of date types are valid, total file %d',
    tsFiles.length,
  );
}

async function checkTimestampType(tsFiles: string[]) {
  const limit = pLimit(5);

  const invalidTypesList = await Promise.all(
    tsFiles.map((file) =>
      limit(async () => {
        const fileContent = await readFile(file, 'utf8');

        const usedDate = matchAll(/^.+: Date/m, fileContent);

        if (usedDate.length > 0) {
          return usedDate;
        }

        const usedTimestampSec = matchAll(/^.+: ITimestampSec/m, fileContent);

        if (usedTimestampSec.length > 0) {
          return usedTimestampSec;
        }

        return undefined;
      }),
    ),
  );

  const errorInfos = zip(tsFiles, invalidTypesList).filter(
    ([_, invalidTypes]) => !!invalidTypes && invalidTypes.length > 0,
  );

  if (errorInfos.length > 0) {
    throw new Error(
      `Following files used 'Date' or 'ITimestampSec', which is not allowed. ` +
        `Please use 'ITimestampMsec' instead. \n${errorInfos
          .map(([file]) => `  - ${file}`)
          .join('\n')}`,
    );
  }
}

async function checkTimeSpanType(tsFiles: string[]) {
  const limit = pLimit(5);

  const invalidTypesList = await Promise.all(
    tsFiles.map((file) =>
      limit(async () => {
        const fileContent = await readFile(file, 'utf8');

        const usedTimeSpanSec = matchAll(/^.+: ITimeSpanSec/m, fileContent);

        if (usedTimeSpanSec.length > 0) {
          return usedTimeSpanSec;
        }

        return undefined;
      }),
    ),
  );

  const errorInfos = zip(tsFiles, invalidTypesList).filter(
    ([_, invalidTypes]) => !!invalidTypes && invalidTypes.length > 0,
  );

  if (errorInfos.length > 0) {
    throw new Error(
      `Following files used 'ITimeSpanSec', which is not allowed. ` +
        `Please use 'ITimeSpanMsec' instead. \n${errorInfos
          .map(([file]) => `  - ${file}`)
          .join('\n')}`,
    );
  }
}
