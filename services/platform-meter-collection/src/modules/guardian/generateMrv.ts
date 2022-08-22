import type {
  IIsoDate,
  IMetricTon,
  ITimeSpanMsec,
  kWh,
} from '@tymlez/platform-api-interfaces';
import { logger } from '@tymlez/backend-libs';
import type { AxiosInstance } from 'axios';
import { getGuardianAxios } from './getGuardianAxios';

export async function generateMrv({
  request,
  axios = getGuardianAxios(),
}: {
  request: IGenerateMrvRequest;
  axios?: AxiosInstance;
}) {
  logger.info('Sending to Guardian', JSON.stringify(request, undefined, 2));
  await axios.post(`/track-and-trace/generate-mrv`, request);
}

export interface IGenerateMrvRequest {
  setting: IMrvSetting;
  policyTag: string;
  deviceId: string;
  requestId: string;
}

export interface IMrvSetting {
  mrvEnergyAmount: kWh;
  mrvCarbonAmount: IMetricTon;
  mrvTimestamp: IIsoDate;
  mrvDuration: ITimeSpanMsec;
}
