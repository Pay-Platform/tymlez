import { useMemo } from 'react';
import type { FC } from 'react';
import type { CardProps } from '@mui/material';
import type { IOverview24 } from '@tymlez/platform-api-interfaces/src/demo/prosumer';
import type { ITimeSeriesPoint } from '@tymlez/platform-api-interfaces/src/demo/series';
import { StaticTimeline } from '../StaticTimeline';

interface Props extends CardProps {
  overview24: IOverview24;
}

export const OverviewSitesGenerationAndConsumption: FC<Props> = ({
  overview24,
}) => {
  const chartSeries = useMemo(
    () =>
      overview24.series.map((series) => ({
        ...series,
        data: series.data.map((item: ITimeSeriesPoint) => ({
          x: item.timestamp,
          y: item.value / 1000,
        })),
      })),
    [overview24],
  );

  return (
    <StaticTimeline
      series={chartSeries}
      xTitle="Time"
      yTitle="MegaWatt hour"
      chartType="area"
      height="250"
      title="SITES OVERVIEW - 24HR GENERATION AND CONSUMPTION"
    />
  );
};
