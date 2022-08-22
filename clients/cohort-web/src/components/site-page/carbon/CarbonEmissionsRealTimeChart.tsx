import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ChangeEvent,
} from 'react';
import type { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  Grid,
  FormGroup,
  FormControlLabel,
  Typography,
  Tooltip,
} from '@mui/material';
import type { ICarbonEmissionsRecord } from '@tymlez/platform-api-interfaces';
import { Chart } from '@tymlez/devias-material-kit/src/components/chart';
import type { ApexOptions } from 'apexcharts';
import { useTheme } from '@mui/material/styles';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';

import { TymlezLogo } from '../../TymlezLogo';
import { useCarbonEmissionsRealtime } from '../api/useCarbonEmissions';
import {
  formatRelatimeDate,
  formatDateTimeForRealtimeTimeseriesTooltip,
  formatMillisecondsWithTimeZone,
} from '../../../utils/date';
import type { ChartSerie, ChartValue } from '../../ChartSerie';

const series: ChartSerie[] = [
  {
    name: 'CO2e Produced (Grid Consumption)',
    color: '#33cc33',
    type: 'column',
    data: [],
  },
  {
    name: 'CO2e Abated (Solar Generation)',
    color: '#00ff99',
    type: 'column',
    data: [],
  },
  {
    name: 'Net CO2e',
    color: '#006600',
    type: 'line',
    data: [],
  },
];

const fillSeries = (
  selectedSeries: string[],
  newValues?: ICarbonEmissionsRecord[],
): ChartSerie[] => {
  if (newValues) {
    for (const [index, serie] of series.entries()) {
      serie.data = newValues.map<ChartValue>((v) => ({
        x: formatMillisecondsWithTimeZone(v.timestamp),
        y:
          index === 0
            ? v.produced
            : index === 1
            ? -1 * v.saved
            : v.produced - v.saved,
      }));
    }
  }
  return series.filter((s) => selectedSeries.includes(s.name));
};

export const CarbonEmissionsRealTimeChart: FC<{
  siteName?: string;
}> = ({ siteName }) => {
  const theme = useTheme();
  const [since, setSince] = useState<number>(Date.now() - 3600000 * 6);
  const handle = useFullScreenHandle();
  const cachedData = useRef<ICarbonEmissionsRecord[]>();
  const defaultSelectedSeries = series.map((i) => i.name);
  const [selectedSeries, setSelectedSeries] = useState<Array<string>>(
    defaultSelectedSeries,
  );
  const handleChangeSeriesOnOff = useCallback(
    (event: ChangeEvent<{ checked: boolean }>, names: string[]) => {
      setSelectedSeries((prevSelectedSeries) =>
        !event.target.checked
          ? prevSelectedSeries.filter((item) => !names.includes(item))
          : series
              .map((item) => item.name)
              .filter(
                (item: string) =>
                  names.includes(item) || prevSelectedSeries.includes(item),
              ),
      );
    },
    [],
  );

  const { data } = useCarbonEmissionsRealtime(since, siteName);
  useEffect(() => {
    if (data && data.length > 0) {
      if (!cachedData.current) {
        cachedData.current = data;
      } else {
        cachedData.current = [...cachedData.current, ...data];
        if (cachedData.current.length >= 10) {
          cachedData.current.splice(0, data.length);
        }
      }
      setSince(data[data.length - 1].timestamp);
    }
  }, [data]);

  const lineChartOptions: ApexOptions = {
    tooltip: {
      enabled: true,
      x: {
        show: true,
        formatter: (val: string | number | Date) => {
          return formatDateTimeForRealtimeTimeseriesTooltip(new Date(val));
        },
      },
      y: {
        formatter: (val) => {
          return `${val.toFixed(6)} kg CO2e`;
        },
      },
    },
    chart: {
      background: 'transparent',
      stacked: true,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: 'linear',
        speed: 1000,
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
    dataLabels: {
      enabled: false,
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
      axisBorder: {
        color: theme.palette.divider,
      },
      axisTicks: {
        color: theme.palette.divider,
        show: true,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
        formatter: (val: string | number | Date) =>
          formatRelatimeDate(new Date(val)),
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
        title: { text: 'kg CO2e' },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
          formatter: (val: number) => {
            return val.toFixed(6);
          },
        },
      },
    ],
  };

  return (
    <FullScreen handle={handle}>
      {handle.active && <TymlezLogo />}
      <Card elevation={12}>
        <CardHeader
          disableTypography
          action={
            // eslint-disable-next-line react/jsx-no-useless-fragment
            <>
              {handle.active ? (
                <Tooltip title="Exit fullscreen">
                  <FullscreenExitIcon fontSize="small" onClick={handle.exit} />
                </Tooltip>
              ) : (
                <Tooltip title="Fullscreen">
                  <FullscreenIcon fontSize="small" onClick={handle.enter} />
                </Tooltip>
              )}
            </>
          }
          title={
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Grid container justifyContent="space-between" spacing={3}>
                <Grid item>
                  <Typography color="textPrimary" variant="h6">
                    REAL TIME CARBON EMISSIONS
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          }
        />
        <Box
          sx={{
            marginLeft: '16px',
          }}
        >
          <FormGroup row>
            <FormControlLabel
              key={series[0].name}
              control={
                <Checkbox
                  checked={selectedSeries.some(
                    (visibleItem) => visibleItem === series[0].name,
                  )}
                  onChange={(event) =>
                    handleChangeSeriesOnOff(event, [series[0].name])
                  }
                  sx={{
                    color: series[0].color,
                    '&.Mui-checked': {
                      color: series[0].color,
                    },
                  }}
                />
              }
              label={series[0].name}
            />
            <FormControlLabel
              key="CO2e Abated (Solar Generation)"
              control={
                <Checkbox
                  checked={selectedSeries.some(
                    (visibleItem) => visibleItem === series[1].name,
                  )}
                  onChange={(event) =>
                    handleChangeSeriesOnOff(event, [
                      series[1].name,
                      series[2].name,
                    ])
                  }
                  sx={{
                    color: series[1].color,
                    '&.Mui-checked': {
                      color: series[1].color,
                    },
                  }}
                />
              }
              label="CO2e Abated (Solar Generation)"
            />
          </FormGroup>
        </Box>
        <Chart
          height={handle.active ? window.innerHeight - 200 : '393'}
          options={lineChartOptions}
          series={fillSeries(selectedSeries, cachedData.current)}
          type="bar"
        />
      </Card>
    </FullScreen>
  );
};
