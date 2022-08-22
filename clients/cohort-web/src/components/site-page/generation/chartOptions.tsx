import type { ApexOptions } from 'apexcharts';
import type { Palette } from '@mui/material';
import SeriesColors from '../../../api/SeriesColors';
import type { ChartType } from '../../../api/ChartType';
import { formatDateTimeForTimeseriesTooltip } from '../../../utils/date';

export function chartOptionMapping(palette: Palette) {
  const chartOptions = new Map<ChartType, ApexOptions>();

  const commonOptions: ApexOptions = {
    tooltip: {
      enabled: true,
      x: {
        show: true,
        formatter: (val) => {
          return formatDateTimeForTimeseriesTooltip(new Date(val));
        },
      },
      y: {
        formatter: (val) => {
          return `${val} kWh`;
        },
      },
    },
    colors: Array.from(SeriesColors.values()),
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: palette.divider,
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
      show: true,
    },
    theme: {
      mode: palette.mode,
    },
    xaxis: {
      type: 'datetime',
      axisBorder: {
        color: palette.divider,
      },
      axisTicks: {
        color: palette.divider,
        show: true,
      },
      labels: {
        style: {
          colors: palette.text.secondary,
        },
        formatter: (val) => {
          return formatDateTimeForTimeseriesTooltip(new Date(val));
        },
      },
    },
    yaxis: [
      {
        axisBorder: {
          color: palette.divider,
          show: true,
        },
        axisTicks: {
          color: palette.divider,
          show: true,
        },
        title: { text: 'kilowatt-hours (kWh)' },
        labels: {
          style: {
            colors: palette.text.secondary,
          },
        },
      },
    ],
  };

  chartOptions.set('line', {
    ...commonOptions,
    chart: {
      background: 'transparent',
      stacked: false,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 2000,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    stroke: {
      curve: 'smooth',
      lineCap: 'butt',
      width: 3,
      show: true,
    },
  });

  chartOptions.set('area', {
    ...commonOptions,
    chart: {
      background: 'transparent',
      stacked: true,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 2000,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
    stroke: {
      curve: 'straight',
      lineCap: 'butt',
      width: 3,
      show: true,
    },
  });

  return chartOptions;
}
