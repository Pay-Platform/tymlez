import { sumBy } from 'lodash';
import React, { FC } from 'react';
import type { IEnergyTimeSeries } from '@tymlez/platform-api-interfaces/src/time-series';
import {
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Box,
} from '@mui/material';
import { useSiteCircuitHistory } from '../../hooks/useSiteCircuitHistory';
import { SiteHistoricalCircuitPieChart } from '../site-page/circuit/SiteHistoricalCircuitPieChart';

interface Props {
  siteName?: string;
}

export const SiteHistoricalCircuitPieChartWidget: FC<Props> = (props) => {
  const { siteName } = props;
  const { data, isLoading } = useSiteCircuitHistory(siteName);
  const tenancyData = data?.series;
  const aggregateFunc = (tenancy: IEnergyTimeSeries) => {
    const value = sumBy(tenancy.data, (i) => i.value) as number;
    return { name: tenancy.name, value };
  };

  const piechartData = tenancyData ? tenancyData.map(aggregateFunc) : [];

  return (
    <Card
      elevation={12}
      sx={{ mb: 3, height: '45vh', display: 'flex', alignItems: 'center' }}
    >
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Typography color="primary" variant="subtitle2" textAlign="left">
          TENANCY USAGE
        </Typography>
        {isLoading ? (
          <Box
            sx={{
              justifyContent: 'center',
              display: 'flex',
            }}
          >
            <CircularProgress sx={{ m: 2 }} />
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: '100%' }}>
            <SiteHistoricalCircuitPieChart data={piechartData} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
