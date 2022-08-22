import type { FC } from 'react';
import React from 'react';
import { Chart } from '@tymlez/devias-material-kit/dist/components/chart';
import type { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material';
import type { IPoint } from 'clients/uon-web/src/api/dashboard/TEMPORARY';

interface Props {
  percentageChange?: number;
  data?: IPoint[];
  isLoading: boolean;
}

export const WidgetLineChart: FC<Props> = ({
  percentageChange = 0,
  data: chartData,
  isLoading,
}) => {
  const theme = useTheme();

  if (isLoading || !chartData) {
    return <div />;
  }
  const color = percentageChange >= 0 ? '#4caf50' : '#f44336';

  const chartOptions: ApexOptions = {
    chart: {
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    colors: [color],
    fill: {
      gradient: {
        opacityFrom: 0.9,
        opacityTo: 0.2,
        shadeIntensity: 0.1,
        stops: [0, 120],
        type: 'vertical',
      },
      type: 'gradient',
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    stroke: {
      width: 3,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };
  const chartSeries = [{ data: chartData.map((e) => e.y) }];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="area"
      width={125}
    />
  );
};
