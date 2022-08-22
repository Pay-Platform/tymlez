import type { ITimeSpanMsec, kWh } from '@tymlez/platform-api-interfaces';

export interface IMeterEnergyDbRow {
  meter_id: string;

  timestamp: Date;
  duration: ITimeSpanMsec;

  eRealKwh_0: kWh;
  eRealKwh_1: kWh;
  eRealKwh_2: kWh;
  eRealKwh_3: kWh;
  eRealKwh_4: kWh;
  eRealKwh_5: kWh;

  eRealNegativeKwh_0: kWh;
  eRealNegativeKwh_1: kWh;
  eRealNegativeKwh_2: kWh;
  eRealNegativeKwh_3: kWh;
  eRealNegativeKwh_4: kWh;
  eRealNegativeKwh_5: kWh;

  eRealPositiveKwh_0: kWh;
  eRealPositiveKwh_1: kWh;
  eRealPositiveKwh_2: kWh;
  eRealPositiveKwh_3: kWh;
  eRealPositiveKwh_4: kWh;
  eRealPositiveKwh_5: kWh;

  eReactiveKwh_0: kWh;
  eReactiveKwh_1: kWh;
  eReactiveKwh_2: kWh;
  eReactiveKwh_3: kWh;
  eReactiveKwh_4: kWh;
  eReactiveKwh_5: kWh;

  eReactiveNegativeKwh_0: kWh;
  eReactiveNegativeKwh_1: kWh;
  eReactiveNegativeKwh_2: kWh;
  eReactiveNegativeKwh_3: kWh;
  eReactiveNegativeKwh_4: kWh;
  eReactiveNegativeKwh_5: kWh;

  eReactivePositiveKwh_0: kWh;
  eReactivePositiveKwh_1: kWh;
  eReactivePositiveKwh_2: kWh;
  eReactivePositiveKwh_3: kWh;
  eReactivePositiveKwh_4: kWh;
  eReactivePositiveKwh_5: kWh;

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
