import axios from 'axios';
import type { ICohortConsumptionRecord } from '@tymlez/cohort-api-interfaces';
import { useQuery, UseQueryResult } from 'react-query';
import type {
  IForecastType,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';

export function useConsumptionRealtime(
  siteName: string | undefined,
  since?: ITimestampMsec,
): UseQueryResult<ICohortConsumptionRecord[]> {
  return useQuery(
    ['consumption-realtime', siteName],
    async () => {
      if (siteName) {
        const { data } = await axios.get<ICohortConsumptionRecord[]>(
          `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/consumption/${siteName}/realtime`,
          {
            params: {
              since,
            },
          },
        );

        return data;
      }
      return undefined;
    },
    {
      // Refetch the data every second
      refetchInterval: 300000,
      // Currently used to handle the bug of only one data point beiing displayed when siwtching between other widgets .e.g consumption->generation->consumption
      cacheTime: 0,
    },
  );
}

export function useConsumptionHistory(
  siteName: string | undefined,
  from: ITimestampMsec,
  to: ITimestampMsec,
): UseQueryResult<ICohortConsumptionRecord[]> {
  return useQuery(
    ['consumption-history', siteName, from, to],
    async () => {
      if (siteName) {
        const { data } = await axios.get<ICohortConsumptionRecord[]>(
          `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/consumption/${siteName}/history/${from}/${to}`,
        );

        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false, retry: false },
  );
}

export function useConsumptionForecast(
  siteName: string | undefined,
  forecastType: IForecastType,
): UseQueryResult<ICohortConsumptionRecord[]> {
  return useQuery(
    ['consumption-forecast', siteName, forecastType],
    async () => {
      if (siteName) {
        const { data } = await axios.get<ICohortConsumptionRecord[]>(
          `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/consumption/${siteName}/forecast/${forecastType}`,
        );

        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );
}
