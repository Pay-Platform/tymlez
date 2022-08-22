import type { FC } from 'react';
import type { ICohortCircuitRealtime } from '@tymlez/cohort-api-interfaces';
import axios from 'axios';
import { useQuery } from 'react-query';
import { energySeriesToChart } from '../../energy-utils';
import { circuitsColorMap } from './utils';
import { StaticTimeline } from '../../StaticTimeline';

const limit = 28;

async function fetchSiteCircuitRealtime(
  siteName?: string,
): Promise<ICohortCircuitRealtime> {
  const params = { siteName, limit };
  const { data }: { data: ICohortCircuitRealtime } =
    await axios.get<ICohortCircuitRealtime>(
      `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/circuit/realtime`,
      { params },
    );
  return data;
}

interface Props {
  siteName?: string;
}

export const SiteRealTimeCircuitChart: FC<Props> = ({ siteName }) => {
  const { data } = useQuery<ICohortCircuitRealtime>(
    ['siteCircuitRealtime', siteName],
    () => fetchSiteCircuitRealtime(siteName),
    {
      staleTime: Infinity,
      refetchInterval: 5 * 60 * 1000,
    },
  );

  const chartSeries = data
    ? energySeriesToChart(data.series, circuitsColorMap)
    : [];

  return (
    <StaticTimeline
      series={chartSeries}
      selectChartType
      yTitle="kilowatt-hours (kWh)"
      height="393"
      title="REAL TIME TENANCY"
    />
  );
};
