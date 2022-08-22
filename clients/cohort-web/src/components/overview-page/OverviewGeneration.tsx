import type { FC } from 'react';
import { useQuery } from 'react-query';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import axios from 'axios';
import { Chart } from '@tymlez/devias-material-kit/dist/components/chart';
import type { ICohortForecastGenerationRecord } from '@tymlez/cohort-api-interfaces';

const LineChart: FC = () => {
  const theme = useTheme();

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
    colors: ['#6cc261'],
    fill: {
      gradient: {
        opacityFrom: 0.8,
        opacityTo: 0.1,
        shadeIntensity: 0.1,
        stops: [0, 100],
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

  const chartSeries = [{ data: [0, 60, 20, 55, 15, 42, 10, 50, 0] }];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="area"
      width={120}
    />
  );
};

interface Props {
  siteName?: string;
}

export const OverviewGeneration: FC<Props> = ({ siteName }) => {
  const { data: generated24, isLoading } = useQuery(
    ['generation-forecast-24h', siteName],
    async () => {
      if (siteName) {
        const { data } = await axios.get<ICohortForecastGenerationRecord>(
          `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/generation/${siteName}/forecast24h`,
        );

        return data;
      }
      return undefined;
    },
    { refetchOnWindowFocus: false },
  );

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        // alignItems: 'flex-start',
        // justifyContent: 'center',
      }}
      elevation={12}
    >
      <CardContent
        sx={{
          alignItems: 'center',
          display: 'flex',
          width: '100%',
          height: '100%',
          py: 2,
        }}
      >
        {isLoading ? (
          'Loading...'
        ) : (
          <Box
            sx={{
              display: 'flex',
              flex: 1,
            }}
          >
            <div>
              <Typography color="primary" variant="subtitle2">
                24HR GENERATION <br />
                FORECAST
              </Typography>
              <Typography color="textPrimary" sx={{ mt: 1 }} variant="h5">
                {generated24 && generated24.estimated
                  ? generated24.estimated.toFixed(2)
                  : 0}{' '}
                kWh
              </Typography>
            </div>
            <Box
              sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}
            >
              <LineChart />
            </Box>
          </Box>
        )}
      </CardContent>
      {/* <Divider />
        <CardActions>
          <Button
            color="primary"
            endIcon={<ArrowRightIcon fontSize="small" />}
            variant="text"
          >
            See all activity
          </Button>
        </CardActions> */}
    </Card>
  );
};
