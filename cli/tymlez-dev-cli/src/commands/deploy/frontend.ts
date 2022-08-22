import path from 'path';
import { deploy } from './frontend/deploy';

const handler = async ({ env, clientName, source, folder }: any) => {
  const outputPath = path.join(process.env.INIT_CWD || '', source);
  const envName = env || process.env.ENV;
  const resolvedClientName = clientName || process.env.CLIENT_NAME;

  await deploy(envName, resolvedClientName, outputPath, folder);
};
const command = 'frontend [source]';
const desc = 'deploy front-end application to s3 & cloudfront';
const builder = {
  env: {
    aliases: ['env', 'e'],
    type: 'string',
    required: false,
    choices: ['dev', 'prod', 'preprod', 'qa'],
    desc: 'Environment to deploy',
  },
  clientName: {
    aliases: ['client-name', 'c'],
    type: 'string',
    required: false,
    desc: 'Client name',
  },

  source: {
    aliases: ['source', 's'],
    type: 'string',
    default: 'out/',
    required: false,
    desc: 'Folder contains output files',
  },

  folder: {
    aliases: ['folder', 'f'],
    default: '',
    type: 'string',
    required: false,
    desc: 'Optional folder where the file will be uploaded to',
  },
};
export { command, desc, builder, handler };
