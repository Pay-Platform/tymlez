import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { endOfDay } from 'date-fns';
import { useQuery, UseQueryResult } from 'react-query';
import type {
  ITimeSpanMsec,
  ICarbonEmissionsRecord,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';
import type { HistoryQuery } from '../components/HistoryQueryForm';

async function fetchSiteCarbonHistory(
  from: ITimeSpanMsec,
  to: ITimestampMsec,
  siteName?: string,
): Promise<ICarbonEmissionsRecord[]> {
  const params = { siteName, from, to };
  const { data } = await axios.get<ICarbonEmissionsRecord[]>(
    `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/carbon/history`,
    { params },
  );
  return data;
}

type UseSiteCarbonHistoryReturn = UseQueryResult<ICarbonEmissionsRecord[]> & {
  query: HistoryQuery;
  setQuery: Dispatch<SetStateAction<HistoryQuery>>;
};

export const useSiteCarbonHistory = (
  siteName?: string,
  startTime?: number,
  endTime?: number,
): UseSiteCarbonHistoryReturn => {
  const startDate = startTime || Date.now() - 7 * 24 * 60 * 60 * 1000;
  const endDate = endTime || Date.now();
  const [query, setQuery] = useState<HistoryQuery>({
    dateRange: [new Date(startDate), new Date(endDate)],
  });

  const useQueryResult = useQuery<ICarbonEmissionsRecord[]>(
    ['siteCarbonHistory', siteName, query],
    () =>
      fetchSiteCarbonHistory(
        (query.dateRange[0] as Date).getTime(),
        endOfDay(query.dateRange[1] as Date).getTime(),
        siteName,
      ),
    {
      staleTime: Infinity,
    },
  );

  return { query, setQuery, ...useQueryResult };
};
