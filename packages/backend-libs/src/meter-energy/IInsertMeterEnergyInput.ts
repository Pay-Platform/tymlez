import type { IIsoDate, ITimeSpanMsec } from '@tymlez/platform-api-interfaces';

export interface IInsertMeterEnergyInput {
  meter_id: string;
  timestamp: IIsoDate;
  duration: ITimeSpanMsec;

  eRealKwh_0: number;
  eRealKwh_1: number;
  eRealKwh_2: number;
  eRealKwh_3: number;
  eRealKwh_4: number;
  eRealKwh_5: number;

  eRealNegativeKwh_0: number;
  eRealNegativeKwh_1: number;
  eRealNegativeKwh_2: number;
  eRealNegativeKwh_3: number;
  eRealNegativeKwh_4: number;
  eRealNegativeKwh_5: number;

  eRealPositiveKwh_0: number;
  eRealPositiveKwh_1: number;
  eRealPositiveKwh_2: number;
  eRealPositiveKwh_3: number;
  eRealPositiveKwh_4: number;
  eRealPositiveKwh_5: number;

  eReactiveKwh_0: number;
  eReactiveKwh_1: number;
  eReactiveKwh_2: number;
  eReactiveKwh_3: number;
  eReactiveKwh_4: number;
  eReactiveKwh_5: number;

  eReactiveNegativeKwh_0: number;
  eReactiveNegativeKwh_1: number;
  eReactiveNegativeKwh_2: number;
  eReactiveNegativeKwh_3: number;
  eReactiveNegativeKwh_4: number;
  eReactiveNegativeKwh_5: number;

  eReactivePositiveKwh_0: number;
  eReactivePositiveKwh_1: number;
  eReactivePositiveKwh_2: number;
  eReactivePositiveKwh_3: number;
  eReactivePositiveKwh_4: number;
  eReactivePositiveKwh_5: number;

  iRMSMin_0: number;
  iRMSMin_1: number;
  iRMSMin_2: number;
  iRMSMin_3: number;
  iRMSMin_4: number;
  iRMSMin_5: number;

  iRMSMax_0: number;
  iRMSMax_1: number;
  iRMSMax_2: number;
  iRMSMax_3: number;
  iRMSMax_4: number;
  iRMSMax_5: number;

  vRMSMin_0: number;
  vRMSMin_1: number;
  vRMSMin_2: number;
  vRMSMin_3: number;
  vRMSMin_4: number;
  vRMSMin_5: number;

  vRMSMax_0: number;
  vRMSMax_1: number;
  vRMSMax_2: number;
  vRMSMax_3: number;
  vRMSMax_4: number;
  vRMSMax_5: number;

  requestId: string;
}
