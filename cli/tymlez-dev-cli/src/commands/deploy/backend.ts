import { deploy } from './backend/index';

const handler = async ({ context, type }: any) => {
  const workingDir = context || process.env.INIT_CWD;
  process.chdir(workingDir);
  await deploy(type);
};
const command = 'backend [context]';
const desc =
  'Build docker image and publish to ECR, Apply terraform deployment';
const builder = {
  context: {
    aliases: ['context', 'c'],
    type: 'string',
    required: false,
    desc: 'The working directory',
  },
  type: {
    aliases: ['type', 't'],
    type: 'string',
    choices: ['tymlez', 'client'],
    required: true,
    desc: 'Type of ECR registry',
  },
};
export { command, desc, builder, handler };
