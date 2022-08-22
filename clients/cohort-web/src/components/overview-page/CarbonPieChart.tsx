import type { FC } from 'react';
import { Chart } from '@tymlez/devias-material-kit/src/components/chart';
import _ from 'lodash';
import { Card, Typography } from '@mui/material';

interface Props {
  produced?: number;
  saved?: number;
  isLoading: boolean;
}

export const CarbonPieChart: FC<Props> = ({ produced, saved, isLoading }) => {
  return (
    <Card
      elevation={12}
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <Typography color="primary" variant="subtitle2" textAlign="center">
            24HR CARBON OUTPUT
          </Typography>
          <Chart
            height="150"
            width="350"
            options={{
              // colors: ['#4878AD', '#4CA781'],
              colors: ['#ffa500', '#75c25d'],
              labels: ['CO2e Produced', 'CO2e Abated'],
              legend: {
                position: 'bottom',
              },
              plotOptions: {
                pie: {
                  startAngle: -90,
                  endAngle: 90,
                  offsetY: 0,
                },
              },
              grid: {
                padding: {
                  bottom: -100,
                },
              },
              tooltip: {
                x: {
                  show: false,
                },
                y: {
                  formatter: (val) => {
                    return `${_.round(val, 2)} kg`;
                  },
                },
              },
            }}
            series={[produced as number, saved as number]}
            type="donut"
          />
        </div>
      )}
    </Card>
  );
};
