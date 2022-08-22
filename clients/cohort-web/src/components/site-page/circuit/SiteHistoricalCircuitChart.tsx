import { Box } from '@mui/material';
import type { FC } from 'react';
import { StaticTimeline } from '../../StaticTimeline';
import { energySeriesToChart } from '../../energy-utils';
import { circuitsColorMap } from './utils';
import { SiteHistoricalCircuitSummary } from './SiteHistoricalCircuitSummary';
import { useSiteCircuitHistory } from '../../../hooks/useSiteCircuitHistory';

interface Props {
  siteName?: string;
}

export const SiteHistoricalCircuitChart: FC<Props> = ({ siteName }) => {
  const { query, setQuery, data, isLoading } = useSiteCircuitHistory(siteName);

  const chartSeries = data
    ? energySeriesToChart(data.series, circuitsColorMap)
    : [];

  const dataTable = (
    <Box mt={3} p={3}>
      <SiteHistoricalCircuitSummary tenancyData={data?.series} />
    </Box>
  );
  return (
    <StaticTimeline
      isLoading={isLoading}
      series={chartSeries}
      selectChartType
      yTitle="kilowatt-hours (kWh)"
      height="393"
      title="HISTORICAL TENANCY"
      historyQuery={query}
      setHistoryQuery={setQuery}
      footer={dataTable}
    />
  );
};
