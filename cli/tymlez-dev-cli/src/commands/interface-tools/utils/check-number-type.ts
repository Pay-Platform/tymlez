import pLimit from 'p-limit';
import fs from 'fs';
import { zip } from 'lodash';
import { matchAll } from '@tymlez/common-libs';
import { getInterfaceFiles } from './getInterfaceFiles';

const { readFile } = fs.promises;

export async function checkNumberType(inputPath = '') {
  const tsFiles = (await getInterfaceFiles(inputPath)).filter(
    (file) => !file.includes('src/demo'),
  );

  const limit = pLimit(5);

  const invalidTypesList = await Promise.all(
    tsFiles.map((file) =>
      limit(async () => {
        const fileContent = await readFile(file, 'utf8');

        const usedNumber = matchAll(/^.+: number/m, fileContent);

        if (usedNumber.length > 0) {
          return usedNumber;
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
      `Following files used 'number', which is not allowed. ` +
        `Please use more meaningful types instead, e.g., 'kWh', 'kW', or add a new type. \n${errorInfos
          .map(([file]) => `  - ${file}`)
          .join('\n')}`,
    );
  }

  console.log(
    'Pass: All usages of `number` type are valid, total files = %d',
    tsFiles.length,
  );
}
