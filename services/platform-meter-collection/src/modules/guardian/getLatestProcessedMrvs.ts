import { runAllSettled } from '@tymlez/common-libs';
import { getLatestProcessedMrv } from '../../modules/guardian';
import { getGuardianAxios } from './getGuardianAxios';

export async function getLatestProcessedMrvs({
  deviceIds,
  policyTag,
}: {
  deviceIds: string[];
  policyTag: string;
}) {
  const axios = getGuardianAxios();

  return await runAllSettled(deviceIds, async (deviceId) => {
    return await getLatestProcessedMrv({
      policyTag,
      deviceId,
      axios,
    });
  });
}
