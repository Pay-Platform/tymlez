import { useState /*useEffect, useMemo*/ } from 'react';
import { useQuery } from 'react-query';
import type { FC } from 'react';

import type { CardProps } from '@mui/material';
import type { kWh } from '@tymlez/platform-api-interfaces';
import { startOfDay, endOfDay } from 'date-fns';
import type { ICohortConsumptionRecord } from '@tymlez/cohort-api-interfaces';
import _ from 'lodash';
import axios from 'axios';

import type { HistoryQuery } from '../../HistoryQueryForm';
// import { useConsumptionHistory } from '../api/useConsumptionData';
import { StaticTimeline } from '../../StaticTimeline';
import { formatMillisecondsWithTimeZone } from '../../../utils/date';

interface SiteHistoricalConsumptionChartProps extends CardProps {
  siteName?: string;
}

const processHistorySeries = (
  consumptionHistory: ICohortConsumptionRecord[],
) => {
  const data = consumptionHistory.map((record: ICohortConsumptionRecord) => {
    return {
      x: Number(formatMillisecondsWithTimeZone(record.timestamp)), //in milliseconds
      y: Number(record.value?.toFixed(4)) as kWh,
    };
  });

  return {
    name: 'Consumption',
    color: '#b0f0a8',
    data,
  };
};

const SiteHistoricalConsumption: FC<SiteHistoricalConsumptionChartProps> = ({
  siteName,
}) => {
  const startDate = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const [historyQuery, setHistoryQuery] = useState<HistoryQuery>({
    dateRange: [new Date(startDate), new Date()],
  });
  const { data: consumptionHistory } = useQuery(
    ['consumption-history', siteName, historyQuery],
    async () => {
      if (siteName) {
        const { data } = await axios.get<ICohortConsumptionRecord[]>(
          `${
            process.env.NEXT_PUBLIC_COHORT_API_URL
          }/dashboard/consumption/${siteName}/history/${
            historyQuery.dateRange[0]
              ? startOfDay(historyQuery.dateRange[0]).getTime()
              : ''
          }/${
            historyQuery.dateRange[1]
              ? endOfDay(historyQuery.dateRange[1]).getTime()
              : ''
          }`,
        );

        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );

  // if (isLoading) {
  //   return <>Loading...</>;
  // }

  // if (isError) {
  //   return (
  //     <span>
  //       Error: {error instanceof Error ? error.message : 'Unknown error'}
  //     </span>
  //   );
  // }

  return (
    <StaticTimeline
      series={[processHistorySeries(consumptionHistory || [])]}
      selectChartType
      yTitle="kilowatt-hours (kWh)"
      height="393"
      title="CONSUMPTION HISTORY"
      historyQuery={historyQuery}
      setHistoryQuery={setHistoryQuery}
    />
  );
};

export default SiteHistoricalConsumption;
