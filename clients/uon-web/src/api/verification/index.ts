import { useState } from 'react';
import { useQuery } from 'react-query';
import type {
  IVcRecord,
  IVerification,
  VerificationPeriod,
  kWh,
  gCo2ePerkWh,
} from '@tymlez/platform-api-interfaces';
import axios from 'axios';
import _ from 'lodash';
import type { VerificationQuery } from '../../components/site-page/verification/VerificationQueryForm';

type VerificationRow = {
  id: number;
  vpId: string;
  vcRecords: Array<IVcRecord>;
  energyValue: kWh;
  timestamp: Date;
  co2Produced: gCo2ePerkWh;
  onChainUrl?: string;
  fuelConsumed?: number;
  waterPumpAmount?: number;
};

export type Verification = {
  records: VerificationRow[];
  num: number;
};

async function fetchSiteVerification(
  siteName: string | null,
  period: VerificationPeriod,
  page: number,
  pageSize: number,
  mocked = false,
): Promise<Verification> {
  const params = { siteName, period, page, pageSize, mocked };
  const { data } = await axios.get<IVerification>(
    `${process.env.NEXT_PUBLIC_UON_API_URL}/dashboard/verification`,
    { params },
  );
  return {
    num: data.num,
    records: data.records.map((r, id) => ({
      id,
      timestamp: new Date(r.timestamp),
      ..._.omit(r, ['timestamp']),
    })),
  };
}

export function useVerificationData(siteName: string, mocked = false) {
  const [query, setQuery] = useState<VerificationQuery>({
    period: 'all',
  });

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);
  const dataFetchQuery = useQuery<Verification>(
    ['dashboard/verification', siteName, query.period, page, pageSize],
    () =>
      fetchSiteVerification(
        siteName || null,
        query.period,
        page,
        pageSize,
        mocked,
      ),
    {
      staleTime: 10000,
    },
  );
  return {
    ...dataFetchQuery,
    page,
    setPage,
    pageSize,
    setPageSize,
    query,
    setQuery,
  };
}
