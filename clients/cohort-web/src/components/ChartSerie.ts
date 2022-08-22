import type { ITimestampMsec } from '@tymlez/platform-api-interfaces';

export interface ChartValue {
  x: ITimestampMsec | Date;
  y: number;
}

export interface ChartSerie {
  name: string;
  type?: string;
  data: ChartValue[];
  color: string;
}
