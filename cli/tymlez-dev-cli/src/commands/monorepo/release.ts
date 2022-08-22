import assert from 'assert';
import { promise as exec } from 'exec-sh';
import chalk from 'chalk';
import { confirm } from './libs/confirm';

async function handler() {
  const { CLIENT_NAME, ENV } = process.env;
  assert(ENV, `ENV is missing`);
  assert(ENV !== 'local', `Cannot release when ENV is 'local'`);
  assert(
    ENV !== 'dev',
    `Cannot release when ENV is 'dev', because we continue to release to dev automatically.`,
  );
  assert(CLIENT_NAME, `CLIENT_NAME is missing`);

  try {
    await exec([`git`, `diff-index`, `--quiet`, `HEAD`].join(' '));
  } catch (ex) {
    console.error(
      chalk.red('Error: Please make sure your git is clean before release.'),
    );
    throw ex;
  }

  const shouldRelease = await confirm(
    `Do you wish to ${CLIENT_NAME}-${ENV} (y/n)?`,
  );

  if (shouldRelease.toLowerCase() === 'y') {
    console.log(`Releasing ${CLIENT_NAME}-${ENV}`);

    await exec(
      [
        `git`,
        `checkout`,
        `-B`,
        `release/${CLIENT_NAME}/${ENV}`,
        `origin/release/${CLIENT_NAME}/${ENV}`,
      ].join(' '),
    );
    await exec([`git`, `pull`, `--no-edit`, `origin`, `main`].join(' '));
    await exec([`git`, `push`].join(' '));
  } else {
    console.log('Skip the release');
  }
}
const command = 'release';
const builder = {};
const desc = 'Release client code base';
export { handler, command, builder, desc };
