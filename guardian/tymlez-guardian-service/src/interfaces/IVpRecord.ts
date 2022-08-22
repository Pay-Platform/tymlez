import type { IMrvSetting } from './IMrvSetting';

export interface IVpRecord {
  vpId: string;
  vcRecords: IMrvSetting[];
  energyType: string;
  energyValue: number;
  timestamp: Date;
  co2Produced: number;
  co2Saved?: number;
  fuelConsumed?: number;
  waterPumpAmount?: number;
  onChainUrl?: string;
}
