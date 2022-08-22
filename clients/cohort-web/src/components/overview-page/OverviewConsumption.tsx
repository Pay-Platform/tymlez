import type { FC } from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { Chart } from '@tymlez/devias-material-kit/dist/components/chart';

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

  const chartSeries = [{ data: [0, 60, 30, 60, 0, 30, 10, 30, 0] }];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="line"
      width={120}
    />
  );
};

interface Props {
  consumed24?: number;
}

export const OverviewConsumption: FC<Props> = ({ consumed24 }) => {
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
              24HR CONSUMPTION
            </Typography>
            <Typography color="textPrimary" sx={{ mt: 1 }} variant="h5">
              {consumed24 ? consumed24 / 1000 : 0} MWh
            </Typography>
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <LineChart />
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
