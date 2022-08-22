import { UUID, IMeterStatus, kWh } from '@tymlez/platform-api-interfaces';

export interface ICohortMeterDetail {
  title: string;
  consumption: kWh;
  generation: kWh;
  status: IMeterStatus;
  meterId: UUID;
}
