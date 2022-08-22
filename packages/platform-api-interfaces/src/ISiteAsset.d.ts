import { kWh } from './kWh';
import { UUID } from './UUID';

export interface ISiteAsset {
  siteId: UUID;
  title: string;
  value: kWh;
}
