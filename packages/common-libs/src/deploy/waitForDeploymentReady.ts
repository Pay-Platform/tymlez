import assert from 'assert';
import axios from 'axios';
import { isEqual } from 'lodash';
import pRetry from 'p-retry';

export async function waitForDeploymentReady({
  versionUrl,
  gitSha,
  gitTag,
}: {
  versionUrl: string;
  gitSha: string;
  gitTag: string;
}) {
  console.log('Waiting for deployment ready.');

  await pRetry(
    async (attemptCount) => {
      console.log(`Attempt ${attemptCount}`);

      const { data: versionInfo } = await axios.get(versionUrl);

      assert(versionInfo, `Failed to get version`);
      if (
        !isEqual(versionInfo, {
          gitSha,
          gitTag,
        })
      ) {
        const errorMessage = `Incorrect version : ${JSON.stringify(
          versionInfo,
        )}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    {
      forever: true,
      maxRetryTime: 500_000,
      maxTimeout: 60_000,
    },
  );

  console.log(
    {
      gitSha,
      gitTag,
    },
    'Deployment is ready',
  );
}
