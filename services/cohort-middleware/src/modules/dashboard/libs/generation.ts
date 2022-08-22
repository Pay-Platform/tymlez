import { getProxy } from '@tymlez/backend-libs';
import type {
  IForecastType,
  IGenerationForecastRecord,
  IGenerationForecastRecordSeries,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';

export async function getGenerationForecast({
  platformApiHost,
  authorizationHeader,
  siteName,
  since,
  forecastType,
}: {
  platformApiHost: string;
  authorizationHeader: string;
  siteName: string;
  since: ITimestampMsec;
  forecastType: IForecastType;
}) {
  return getProxy<IGenerationForecastRecordSeries>(
    `http://${platformApiHost}/api/generation/${siteName}/forecast/${forecastType}/Solar`,
    authorizationHeader,
    '',
    { since },
  );
}

export async function getGenerationHistory({
  platformApiHost,
  authorizationHeader,
  siteName,
  from,
  to,
  forecastType,
}: {
  platformApiHost: string;
  authorizationHeader: string;
  siteName: string;
  from: ITimestampMsec;
  to: ITimestampMsec;
  forecastType: IForecastType;
}) {
  return getProxy<IGenerationForecastRecordSeries>(
    `http://${platformApiHost}/api/generation/${siteName}/history/${forecastType}/Solar`,
    authorizationHeader,
    '',
    { from, to },
  );
}

export async function getGenerationForecast24h({
  platformApiHost,
  authorizationHeader,
  siteName,
}: {
  platformApiHost: string;
  authorizationHeader: string;
  siteName: string;
}) {
  return getProxy<IGenerationForecastRecord>(
    `http://${platformApiHost}/api/generation/${siteName}/forecast/solar/24h`,
    authorizationHeader,
  );
}
