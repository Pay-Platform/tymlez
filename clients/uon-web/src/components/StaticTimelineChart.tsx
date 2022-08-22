/**
 * Widget to show static timeline chart with one or more series.
 */
import { FC, useMemo } from 'react';
import { Chart } from '@tymlez/devias-material-kit/src/components/chart';
import type { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import _ from 'lodash';
import type { bool } from 'aws-sdk/clients/signer';
import { formatDateTimeForTimeseriesTooltip } from '../utils/date';

export const seriesColors = [
  '#32a15c', // green
  '#cc3532', // red
  '#9651aa', // purple
  '#6cc261',
  '#7783DB',
  '#FF9800',
  '#116306',
  '#8030af',
];

export type ChartType = 'area' | 'line' | 'bar';

export type Point = {
  x: number | Date;
  y: number;
};

export type Series = {
  name: string;
  color?: string;
  data: Array<Point>;
};

interface Props {
  series?: Array<Series>;
  type: ChartType;
  width?: string | number;
  height?: string | number;
  xTitle?: string;
  yTitle?: string;
  enableDataLabels?: boolean;
  tooltip?: {
    enabled?: boolean;
    x?: {
      show?: bool;
      formatter?: (val: string | number | Date) => string;
    };
    y?: {
      show?: bool;
      formatter?: (val: string | number | Date) => string;
    };
  };
}

export const StaticTimelineChart: FC<Props> = ({
  series,
  type,
  width,
  height,
  xTitle,
  yTitle,
  enableDataLabels,
  tooltip,
}) => {
  const theme = useTheme();

  const chartOptions: ApexOptions = useMemo(
    () => ({
      tooltip: {
        enabled: true,
        x: {
          show: true,
          formatter: (val: string | number | Date) => {
            return formatDateTimeForTimeseriesTooltip(new Date(val));
          },
        },
        y: {
          formatter: (val) => {
            return `${val} kWh`;
          },
        },
        ...tooltip,
      },
      chart: {
        background: 'transparent',
        stacked: type !== 'line',
        toolbar: {
          show: false,
        },
        animations: {
          enabled: true,
          easing: 'linear',
          dynamicAnimation: {
            speed: 200,
          },
        },
      },
      colors: seriesColors,
      dataLabels: {
        enabled: enableDataLabels ?? false,
      },
      grid: {
        borderColor: theme.palette.divider,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      legend: {
        show: false,
      },
      markers: {
        hover: {
          size: undefined,
          sizeOffset: 2,
        },
        radius: 2,
        shape: 'circle',
        size: 2,
        strokeWidth: 0,
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'butt',
        width: 2,
      },
      theme: {
        mode: theme.palette.mode,
      },
      xaxis: {
        type: 'datetime',
        ...(xTitle && { title: { text: xTitle } }),
        axisBorder: {
          color: theme.palette.divider,
        },
        axisTicks: {
          color: theme.palette.divider,
          show: true,
        },
        labels: {
          show: true,
          style: {
            colors: theme.palette.text.secondary,
          },
          datetimeUTC: false,
        },
      },
      yaxis: [
        {
          axisBorder: {
            color: theme.palette.divider,
            show: true,
          },
          axisTicks: {
            color: theme.palette.divider,
            show: true,
          },
          ...(yTitle && { title: { text: yTitle } }),
          labels: {
            formatter: (value) => String(_.round(value, 3)),
            style: {
              colors: theme.palette.text.secondary,
            },
          },
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, type, xTitle, yTitle, enableDataLabels],
  );
  return (
    <Chart
      series={series}
      height={height}
      width={width}
      options={chartOptions}
      type={type}
    />
  );
};
