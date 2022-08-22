import type { FC } from 'react';
import React from 'react';
import { Card, CircularProgress } from '@mui/material';
import { StaticTimeline } from '../../StaticTimeline';
import { useSiteMixData } from '../../../api/dashboard';

export const EnergyMixChart: FC = () => {
  const startDate = new Date('2022-03-30');
  const endDate = new Date('2022-04-02');
  const { query, setQuery, data, isLoading } = useSiteMixData(
    startDate,
    endDate,
  );

  const colorMap: { [x: string]: string } = {
    'Solar Array': '#FF9800',
    Genset: '#6cc261',
    Battery: '#8030af',
  };

  if (data?.energyMix) {
    const chartSeries = data?.energyMix.map((item) => ({
      ...item,
      color: colorMap[item.name],
    }));

    return (
      <StaticTimeline
        isLoading={isLoading}
        series={chartSeries}
        selectChartType
        yTitle="kilowatt-hours (kWh)"
        height="393"
        title={data?.title}
        historyQuery={query}
        setHistoryQuery={setQuery}
      />
    );
  }
  return (
    <Card
      elevation={12}
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress sx={{ m: 2 }} />
    </Card>
  );
};
