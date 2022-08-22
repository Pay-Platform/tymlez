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
import type { Series, ChartType } from './StaticTimelineChart';

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

export const ReportTimelineChart: FC<Props> = ({
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
            if (!val) {
              return '';
            }
            return formatDateTimeForTimeseriesTooltip(new Date(val));
          },
        },
        y: {
          formatter: (val) => {
            return `${val} kg CO2e`;
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
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
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
        size: 0,
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
      fill: {
        gradient: {
          colorStops: [
            [
              { offset: 0, color: '#8bcc43', opacity: 1 },
              { offset: 2, color: '#f5f6fa', opacity: 1 },
            ],
            [
              { offset: 0, color: '#c8d4e0', opacity: 1 },
              { offset: 2, color: '#b9df94', opacity: 1 },
            ],
          ],
          type: 'vertical',
        },
        type: 'gradient',
      },
      xaxis: {
        type: 'datetime',
        ...(xTitle && { title: { text: xTitle } }),
        axisBorder: {
          color: theme.palette.divider,
          show: false,
        },
        axisTicks: {
          color: theme.palette.divider,
          show: false,
        },
        labels: {
          show: false,
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
            show: false,
          },
          axisTicks: {
            color: theme.palette.divider,
            show: false,
          },
          ...(yTitle && { title: { text: yTitle } }),
          labels: {
            show: false,
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
