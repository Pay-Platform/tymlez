import type { IIsoDate } from './IIsoDate';
import type { IMetricTon } from './IMetricTon';
import type { ITimeSpanMsec } from './ITimeSpanMsec';
import type { kWh } from './kWh';

export interface IMrvSetting {
  mrvEnergyAmount: kWh;
  mrvCarbonAmount: IMetricTon;
  mrvTimestamp: IIsoDate;
  mrvDuration: ITimeSpanMsec;
  mrvFuelAmount?: IMetricTon;
  mrvWaterPumpAmount?: IMetricTon;
}
