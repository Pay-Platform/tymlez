import {
  kWh,
  UUID,
  ISiteStatus,
  ILatitude,
  ILongitude,
} from '@tymlez/platform-api-interfaces';
import { ICohortMeterDetail } from './ICohortMeterDetail';

export interface ICohortSiteDetail {
  name: string;
  title: string;
  label: string;
  address: string;
  region: string;
  lat: ILatitude;
  lng: ILongitude;

  consumption?: kWh;
  generation: kWh;
  status?: ISiteStatus;

  meters: ICohortMeterDetail[];
}
