import type { ITimestampMsec } from './ITimestampMsec';
import type { gCo2ePerkWh } from './gCo2ePerkWh';
import type { kWh } from './kWh';
import type { RecordsNum } from './UUID';

export interface IVcRecord {
  mrvEnergyAmount: kWh;
  vcId?: string;
  mrvFuelAmount?: kWh;
  mrvCarbonAmount: kWh;
  mrvTimestamp: ITimestampMsec;
  mrvDuration: ITimestampMsec;
  mrvWaterPumpAmount?: kWh;
  mrvCo2?: gCo2ePerkWh;
}

export interface IVpRecord {
  vpId: string;
  vcRecords: Array<IVcRecord>;
  energyValue: kWh;
  timestamp: ITimestampMsec;
  co2Produced: gCo2ePerkWh;
  onChainUrl?: string;
  fuelConsumed?: kWh;
  waterPumpAmount?: kWh;
}

export type VerificationPeriod = 'all' | '24h';

export interface IVerification {
  date?: string;
  records: Array<IVpRecord>;
  num: RecordsNum;
}
