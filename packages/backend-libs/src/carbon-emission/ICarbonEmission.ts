import type { IIsoDate } from '@tymlez/platform-api-interfaces';

export interface ICarbonEmission {
  regionid: string;
  settlement_date: IIsoDate;
  energy: string | number;
  emission: string | number;
  factor: string | number;
}
