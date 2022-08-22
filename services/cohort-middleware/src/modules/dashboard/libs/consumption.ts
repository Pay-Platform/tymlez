import { getProxy } from '@tymlez/backend-libs';
import type { ICohortConsumptionRecord } from '@tymlez/cohort-api-interfaces';
import type {
  IForecastType,
  ILatitude,
  ILongitude,
  IMeterReadingType,
  ITimestampMsec,
  ITimestampSec,
  UUID,
} from '@tymlez/platform-api-interfaces';

export async function getConsumptionRealtime({
  platformApiHost,
  correlationId,
  authorizationHeader,
  meterId,
  columns,
  since,
}: {
  platformApiHost: string;
  correlationId: string;
  authorizationHeader: string;
  meterId: string;
  columns: string;
  since?: ITimestampMsec;
}) {
  return getProxy<ICohortConsumptionRecord[]>(
    `http://${platformApiHost}/api/consumption/realtime`,
    authorizationHeader,
    correlationId,
    {
      meterId,
      columns,
      since,
    },
  );
}

export async function getConsumptionForecast({
  platformApiHost,
  authorizationHeader,
  siteId,
  forecastType,
}: {
  platformApiHost: string;
  authorizationHeader: string;
  siteId: UUID;
  forecastType: IForecastType;
}) {
  return getProxy<ICohortConsumptionRecord[]>(
    `http://${platformApiHost}/api/consumption/${siteId}/forecast/${forecastType}`,
    authorizationHeader,
  );
}

export async function getConsumptionHistory({
  correlationId,
  platformApiHost,
  authorizationHeader,
  siteName,
  from,
  to,
  meterId,
  columns,
}: {
  correlationId: string;
  platformApiHost: string;
  authorizationHeader: string;
  siteName: string;
  from: ITimestampMsec;
  to: ITimestampMsec;
  meterId: string;
  columns: string;
}) {
  return getProxy<ICohortConsumptionRecord[]>(
    `http://${platformApiHost}/api/consumption/${siteName}/history/${from}/${to}`,
    authorizationHeader,
    correlationId,
    {
      meterId,
      columns,
    },
  );
}

export async function getMeterBySiteId({
  correlationId,
  platformApiHost,
  authorizationHeader,
  siteId,
}: {
  correlationId: string;
  platformApiHost: string;
  authorizationHeader: string;
  siteId: UUID;
}) {
  return getProxy(
    `http://${platformApiHost}/api/meter-info/meters-by-site/${siteId}`,
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

export interface Client {
  name: string;

  label: string;
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
