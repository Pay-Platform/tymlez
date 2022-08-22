import type { IIsoDate } from '@tymlez/platform-api-interfaces';

export interface IProcessedMrv {
  deviceId: string;
  policyTag: string;
  timestamp: IIsoDate;
}
