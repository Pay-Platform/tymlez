import type { AxiosInstance } from 'axios';
import { getGuardianAxios } from './getGuardianAxios';
import type { IProcessedMrv } from './IProcessedMrv';

export async function getLatestProcessedMrv({
  deviceId,
  policyTag,
  axios = getGuardianAxios(),
}: {
  policyTag: string;
  deviceId: string;
  axios?: AxiosInstance;
}): Promise<IProcessedMrv | undefined> {
  try {
    const { data } = await axios.get(
      `/track-and-trace/latest-mrv/${policyTag}/${deviceId}`,
    );

    return data as IProcessedMrv;
  } catch (ex: any) {
    if (ex.response?.status === 404) {
      return undefined;
    }

    throw ex;
  }
}
