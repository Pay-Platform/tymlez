import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import type { ICohortCircuitHistory } from '@tymlez/cohort-api-interfaces';
import { useQuery, UseQueryResult } from 'react-query';
import type { HistoryQuery } from '../components/HistoryQueryForm';

async function fetchSiteCircuitHistory(
  siteName: string | null,
  from: Date | null,
  to: Date | null,
): Promise<ICohortCircuitHistory> {
  const params = { siteName, from, to };
  const { data } = await axios.get<ICohortCircuitHistory>(
    `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/circuit/history`,
    { params },
  );
  return data;
}

type UseSiteCircuitHistoryReturn = UseQueryResult<ICohortCircuitHistory> & {
  query: HistoryQuery;
  setQuery: Dispatch<SetStateAction<HistoryQuery>>;
};

export const useSiteCircuitHistory = (
  siteName?: string,
  startTime?: number,
  endTime?: number,
): UseSiteCircuitHistoryReturn => {
  const startDate = startTime || Date.now() - 24 * 60 * 60 * 1000;
  const endDate = endTime || Date.now();
  const [query, setQuery] = useState<HistoryQuery>({
    dateRange: [new Date(startDate), new Date(endDate)],
  });

  const useQueryResult = useQuery<ICohortCircuitHistory>(
    ['siteCircuitHistory', siteName, query],
    () =>
      fetchSiteCircuitHistory(
        siteName || null,
        query.dateRange[0] as Date,
        query.dateRange[1] as Date,
      ),
    {
      staleTime: Infinity,
    },
  );

  return { query, setQuery, ...useQueryResult };
};
