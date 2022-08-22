import { checkDateType } from './utils/check-date-type';
import { checkNumberType } from './utils/check-number-type';

const command = 'check-type [path] [type]';
const desc = 'Validate usage of date type';
const builder = {
  path: {
    aliases: ['path'],
    type: 'string',
    required: false,
    desc: 'The path of the file to check',
  },
  type: {
    aliases: ['t'],
    type: 'string',
    choices: ['date', 'number', 'both'],
    required: true,
    desc: 'Data type to check',
    default: 'both',
  },
};

async function handler({ path, type }: { path: string; type: string }) {
  const dirPath = path || process.env.INIT_CWD || __dirname;

  console.log(`Checking "${type}" type usage in ${dirPath}`);
  switch (type) {
    case 'date':
      await checkDateType(dirPath);
      break;
    case 'number':
      await checkNumberType(dirPath);
      break;
    case 'both':
      await checkDateType(dirPath);
      await checkNumberType(dirPath);
  }
}

export { command, desc, handler, builder };
