import { getProxy } from '@tymlez/backend-libs';
import type {
  IMeterReadingType,
  ILatitude,
  ILongitude,
  ITimestampSec,
} from '@tymlez/platform-api-interfaces';
import type { Client } from './consumption';

export async function getMeterBySiteName({
  correlationId,
  platformApiHost,
  authorizationHeader,
  siteName,
}: {
  correlationId: string;
  platformApiHost: string;
  authorizationHeader: string;
  siteName: string;
}) {
  // TODO: Correct the return data type
  return getProxy<any>(
    `http://${platformApiHost}/api/meter-info/meters-by-site/${siteName}`,
    authorizationHeader,
    correlationId,
  );
}

export function findChannelIndexes(channels: Channel[], meterName: string) {
  return channels.reduce((prevVal: number[], currentVal: Channel) => {
    if (currentVal.meter === meterName) {
      prevVal.push(currentVal.index);
    }
    return prevVal;
  }, [] as number[]);
}

/* eslint-disable camelcase */
export interface Meter {
  name: string;

  meter_id: string;

  site: Site;

  label: string;

  isMain?: boolean;

  description: string;

  type: IMeterReadingType;

  lat?: ILatitude;

  lng?: ILongitude;

  interval?: ITimestampSec;

  billingChannelIndex?: number;
}

export interface Site {
  name: string;

  client: Client;

  label: string;

  address: string;

  lat: ILatitude;

  lng: ILongitude;

  hasSolar: boolean;

  solcastResourceId?: string;
}

export interface Channel {
  name: string;

  meter: string;

  circuit: Circuit;

  index: number;

  label: string;
}

export interface Circuit {
  name: string;

  meter: string;

  label: string;
}
