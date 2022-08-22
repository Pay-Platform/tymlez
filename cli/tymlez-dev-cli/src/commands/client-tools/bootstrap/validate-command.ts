/* eslint-disable import/no-dynamic-require, global-require, @typescript-eslint/no-var-requires */

import path from 'path';
import { logger, validateBootstrap } from '@tymlez/backend-libs';
import type { IBootstrap } from '@tymlez/backend-libs';

async function handler({ filePath }: { filePath: string }) {
  const bootstrap: IBootstrap = require(path.resolve(filePath));

  await validateBootstrap({ bootstrap });

  logger.info(`Bootstrap file: '${filePath}' is valid`);
}

const command = 'validate [filePath]';
const desc = 'Validate bootstrap file';
const builder = {
  filePath: {
    aliases: ['filePath', 'f'],
    type: 'string',
    required: true,
    desc: 'Path to the bootstrap file',
  },
};

export { command, desc, handler, builder };
