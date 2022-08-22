import { getInterfaceFiles } from './utils/getInterfaceFiles';

const command = 'check-interface [path]';
const desc = 'Validate usage of interface';
const builder = {
  path: {
    aliases: ['path'],
    type: 'string',
    required: false,
    desc: 'The path of the file to check',
  },
};

async function handler({ path }: { path: string }) {
  const dirPath = path || process.env.INIT_CWD || __dirname;
  const tsFiles = await getInterfaceFiles(dirPath);
  console.log('Checking interface files in %s', dirPath);
  const nonInterfaceFiles = tsFiles.filter((file) => !file.endsWith('.d.ts'));

  if (nonInterfaceFiles.length > 0) {
    throw new Error(
      `This project can only contain TypeScript interface files (*.d.ts). ` +
        `Following files are not interface: \n${nonInterfaceFiles
          .map((file) => `  - ${file}`)
          .join('\n')}`,
    );
  }

  console.log(
    'Pass: All files are TypeScript interface files, total files: %d',
    tsFiles.length,
  );
}

export { command, desc, handler, builder };
