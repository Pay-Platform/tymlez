import { useRef, useState, useEffect } from 'react';
import type { FC } from 'react';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@tymlez/devias-material-kit/dist/components/chart';
import {
  Box,
  Card,
  CardHeader,
  Tooltip,
  Typography,
  FormControl,
  Grid,
  RadioGroup,
  Radio,
  FormControlLabel,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type {
  ICohortConsumptionRecord,
  ICohortMeterDetail,
} from '@tymlez/cohort-api-interfaces';
import type { kWh } from '@tymlez/platform-api-interfaces';
import _ from 'lodash';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import type { ChartType } from '../../../api/ChartType';
import { useConsumptionRealtime } from '../api/useConsumptionData';
import { TymlezLogo } from '../../TymlezLogo';
import {
  formatRelatimeDate,
  formatDateTimeForRealtimeTimeseriesTooltip,
  formatMillisecondsWithTimeZone,
} from '../../../utils/date';

interface ISiteRealtimeConsumptionProps {
  siteName?: string;
  meters: ICohortMeterDetail[];
}

// const timerange = 7;
interface ChartSerie {
  name: string;
  data: { x: Date; y: kWh }[];
  color: string;
  total?: number;
  utilised?: number;
}

const groupRecordsAsChartSeries = (
  consumptionRealtimeRecords: ICohortConsumptionRecord[],
): ChartSerie[] => {
  const data = consumptionRealtimeRecords.map((record) => {
    return {
      x: new Date(Number(formatMillisecondsWithTimeZone(record.timestamp))), //in milliseconds
      y: Number(record.value?.toFixed(4)) as kWh,
    };
  });

  return _.castArray({
    name: 'consumption',
    data,
    color: '#b0f0a8',
  });
};

const SiteRealtimeConsumption: FC<ISiteRealtimeConsumptionProps> = ({
  siteName,
  meters,
}) => {
  const theme = useTheme();
  const handle = useFullScreenHandle();

  const sources = new Array<string>();

  for (const meter of meters) {
    if (!sources.includes(meter.title)) {
      sources.push(meter.title);
    }
  }

  const [since, setSince] = useState(new Date().getTime() - 3600000);
  const sinceRef = useRef(since);

  useEffect(() => {
    sinceRef.current = since;
  }, [since]);

  const [chartSeries, setChartSeries] = useState<ChartSerie[]>([]);
  const chartSeriesRef = useRef<ChartSerie[]>(chartSeries);
  useEffect(() => {
    chartSeriesRef.current = chartSeries;
  }, [chartSeries]);

  const {
    data: consumptionRecords,
    isLoading,
    isError,
    error,
  } = useConsumptionRealtime(siteName, since);

  useEffect(() => {
    if (
      chartSeriesRef.current.length === 0 &&
      consumptionRecords &&
      consumptionRecords.length > 0
    ) {
      const records = groupRecordsAsChartSeries(consumptionRecords);
      setChartSeries(records);
      setSince(records[0].data.slice(-1)[0].x.getTime());
    } else if (
      consumptionRecords &&
      consumptionRecords.length > 0 &&
      sinceRef.current !== consumptionRecords[0].timestamp
    ) {
      const groupRecords = groupRecordsAsChartSeries(consumptionRecords);
      for (const cs of chartSeriesRef.current) {
        for (const gr of groupRecords[0].data) {
          cs.data.push({
            x: gr.x,
            y: gr.y,
          });
          cs.data.splice(0, 1);
        }
      }
      setSince(chartSeriesRef.current[0].data.slice(-1)[0].x.getTime());
      setChartSeries(chartSeriesRef.current);
    }
  }, [consumptionRecords]);

  const [chartType, updateChartType] = useState<ChartType>('line');

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
          return `${val} kWh`;
        },
      },
    },
    chart: {
      background: 'transparent',
      stacked: false,
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
        title: { text: 'kWh' },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
    ],
  };

  const areaChartOptions: ApexOptions = {
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
          return `${val} kWh`;
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
        title: { text: 'kilowatt-hours (kWh)' },
        labels: {
          style: {
            colors: theme.palette.text.secondary,
          },
        },
      },
    ],
  };

  const handleChangeChartType = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    updateChartType(event.target.value as ChartType);
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return (
      <span>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </span>
    );
  }

  return (
    <FullScreen handle={handle}>
      {handle.active && <TymlezLogo />}
      <Card elevation={12}>
        <CardHeader
          disableTypography
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
                    REAL TIME CONSUMPTION
                  </Typography>
                </Grid>
                <Grid item>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-label="chart type"
                      name="chartType"
                      value={chartType}
                      onChange={handleChangeChartType}
                      defaultValue="line"
                    >
                      <FormControlLabel
                        value="line"
                        control={<Radio color="primary" />}
                        label="Line"
                        labelPlacement="end"
                      />
                      <FormControlLabel
                        value="area"
                        control={<Radio color="primary" />}
                        label="Area"
                        labelPlacement="end"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item>
                  {handle.active ? (
                    <Tooltip title="Exit fullscreen">
                      <FullscreenExitIcon
                        fontSize="small"
                        onClick={handle.exit}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Fullscreen">
                      <FullscreenIcon fontSize="small" onClick={handle.enter} />
                    </Tooltip>
                  )}
                </Grid>
              </Grid>
            </Box>
          }
        />
        {chartType === 'line' && (
          <Chart
            height={handle.active ? window.innerHeight - 200 : '393'}
            options={lineChartOptions}
            series={chartSeries}
            type="line"
          />
        )}
        {chartType === 'area' && (
          <Chart
            height={handle.active ? window.innerHeight - 200 : '393'}
            options={areaChartOptions}
            series={chartSeries}
            type="area"
          />
        )}
      </Card>
    </FullScreen>
  );
};

export default SiteRealtimeConsumption;
