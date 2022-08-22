import type { MeterId } from '@tymlez/platform-api-interfaces';

export interface ICircuitMapRecord {
  label: string;
  meterId: MeterId;
  isMain: boolean;
  indexes: number[];
}
export interface ICircuitMap {
  circuits: ICircuitMapRecord[];
}

export interface IMeterInfoService {
  getCircuitMapBySite(siteName: string): Promise<ICircuitMap>;
}
