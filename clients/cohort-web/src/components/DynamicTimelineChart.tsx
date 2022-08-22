/**
 * Widget to show timeline chart with one or more series.
 * It's realtime. New points added on the right end,
 * and the whole chart is shifting to the left side.
 */
import { FC, useMemo } from 'react';
import type { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import { Chart } from '@tymlez/devias-material-kit/src/components/chart';
import type { ChartType } from './StaticTimelineChart';
import { formatDateTimeForTimeseriesTooltip } from '../utils/date';

// export const colors = ['#6cc261', '#7783DB', '#FF9800', '#116306', '#8030af'];
export const seriesColors = [
  '#6cc261',
  '#7783DB',
  '#FF9800',
  '#116306',
  '#8030af',
];

interface Props {
  series?: Array<any>;
  type: ChartType;
  width?: string | number;
  height?: string | number;
  xTitle?: string;
  yTitle?: string;
  enableDataLabels?: boolean;
  limit: number;
}

export const DynamicTimelineChart: FC<Props> = ({
  series,
  type,
  width,
  height,
  xTitle,
  yTitle,
  enableDataLabels,
  limit,
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
        events: {
          animationEnd: makeAnimationEndHandler(limit),
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
        size: 4,
        strokeWidth: 0,
      },
      stroke: {
        curve: 'smooth',
        lineCap: 'butt',
        width: 3,
      },
      theme: {
        mode: theme.palette.mode,
      },
      xaxis: {
        type: 'datetime',
        ...(xTitle && {
          title: {
            text: xTitle,
          },
        }),
        axisBorder: {
          color: theme.palette.divider,
        },
        axisTicks: {
          color: theme.palette.divider,
          show: false,
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
          ...(yTitle && { title: { text: yTitle } }),
          axisBorder: {
            color: theme.palette.divider,
            show: true,
          },
          tickAmount: 5,
          axisTicks: {
            color: theme.palette.divider,
            show: true,
          },
          labels: {
            style: {
              colors: theme.palette.text.secondary,
            },
            formatter: (value: number) => {
              return value?.toFixed(3);
            },
          },
        },
      ],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme, type, xTitle, yTitle, enableDataLabels, limit],
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

const makeAnimationEndHandler = (limit: number) => (chartCtx: any) => {
  let { series } = chartCtx.w.config;
  if (series.length === 0) {
    return;
  }

  const n = series[0].data.length;
  if (n <= limit) {
    return;
  }
  series = series.map((_series: any) => {
    const data = _series.data.slice();
    data.splice(0, data.length - limit);
    return { data };
  });
  setTimeout(() => {
    chartCtx.updateOptions({ series }, false, false);
  }, 0);
};
