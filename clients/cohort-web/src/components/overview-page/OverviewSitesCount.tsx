import type { FC } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@tymlez/devias-material-kit/dist/components/chart';

const BarChart: FC = () => {
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
    dataLabels: {
      enabled: false,
    },
    grid: {
      show: false,
    },
    states: {
      normal: {
        filter: {
          type: 'none',
          value: 0,
        },
      },
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    stroke: {
      width: 0,
    },
    theme: {
      mode: theme.palette.mode,
    },
    tooltip: {
      enabled: false,
    },
    xaxis: {
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  const chartSeries = [{ data: [10, 20, 30, 40, 50, 60, 5] }];

  return (
    <Chart options={chartOptions} series={chartSeries} type="bar" width={120} />
  );
};
interface Props {
  sitenum?: number;
}

export const OverviewSitesCount: FC<Props> = ({ sitenum }) => {
  return (
    <Card elevation={12}>
      <CardContent
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        {/* <Chart
          height="160"
          options={chartOptions}
          series={chartSeries}
          type="radialBar"
          width="160"
        /> */}
        <Box
          sx={{
            display: 'flex',
            flex: 1,
          }}
        >
          <div>
            <Typography color="primary" variant="subtitle2">
              SITES
            </Typography>
            <Typography color="textPrimary" sx={{ mt: 1 }} variant="h5">
              {sitenum}
            </Typography>
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <BarChart />
        </Box>
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
