import type { FC } from 'react';
import { Chart } from '@tymlez/devias-material-kit/dist/components/chart';
import { Box, Card, CardHeader, Typography } from '@mui/material';
// import { useGECompliance } from '~apps/prosumer/api/useConsumption';
// import { useConfig } from '~features/config';
// import useAuth from '../../../../api/auth';

const data = {
  series: [
    {
      name: 'Fossil Fuels',
      color: '#116306',
    },
    {
      name: 'Purchased GE',
      color: '#6cc261',
    },
    {
      name: 'Generated GE',
      color: '#b0f0a8',
    },
  ],
  categories: [],
};

export const GreenEnergyComplianceChart: FC = (props) => {
  // const config = useConfig();
  // const auth = useAuth(config);
  // const compliance = useGECompliance(config, auth);

  return (
    <Card elevation={12} {...props}>
      <CardHeader
        title={
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography color="textPrimary" variant="h6">
              GREEN ENERGY COMPLIANCE
            </Typography>
          </Box>
        }
      />
      <Box
        sx={{
          height: 336,
          minWidth: 500,
          px: 2,
        }}
      >
        <Chart
          height="300"
          options={{
            colors: data.series.map((s) => s.color),
            labels: data.series.map((s) => s.name),
            legend: {
              position: 'bottom',
            },
          }}
          series={[36, 34, 30]}
          type="pie"
        />
      </Box>
    </Card>
  );
};
