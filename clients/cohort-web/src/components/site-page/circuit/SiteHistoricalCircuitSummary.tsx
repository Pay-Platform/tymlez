import type { FC } from 'react';
import type { IEnergyTimeSeries } from '@tymlez/platform-api-interfaces/src/time-series';
import { Grid } from '@mui/material';
import { sumBy } from 'lodash';
import { SiteHistoricalCircuitTable } from './SiteHistoricalCircuitTable';
import { SiteHistoricalCircuitPieChart } from './SiteHistoricalCircuitPieChart';

interface Props {
  tenancyData?: IEnergyTimeSeries[];
}

export const SiteHistoricalCircuitSummary: FC<Props> = ({ tenancyData }) => {
  const aggregateFunc = (tenancy: IEnergyTimeSeries) => {
    const value = sumBy(tenancy.data, (i) => i.value) as number;
    return { name: tenancy.name, value };
  };

  const data = tenancyData ? tenancyData.map(aggregateFunc) : [];

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={6}>
        <SiteHistoricalCircuitTable data={data} />
      </Grid>
      <Grid item xs={12} md={6} minHeight={350}>
        <SiteHistoricalCircuitPieChart data={data} />
      </Grid>
    </Grid>
  );
};
