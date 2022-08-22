import type { FC } from 'react';
import { Chart } from '@tymlez/devias-material-kit/src/components/chart';
import { round } from 'lodash';
import { circuitsColorMap } from './utils';
import { stringToColor } from '../../../utils/style';

interface Props {
  data: { name: string; value: number }[];
}

export const SiteHistoricalCircuitPieChart: FC<Props> = ({ data }) => {
  const labels = data.map((i) => i.name);
  const values = data.map((i) => i.value);
  const colors = labels.map(
    (label) => circuitsColorMap[label] || stringToColor(label),
  );
  return (
    <Chart
      height="100%"
      width="100%"
      options={{
        colors,
        labels,
        legend: {
          position: 'bottom',
        },
        tooltip: {
          x: {
            show: false,
          },
          y: {
            formatter: (val) => {
              return `${round(val, 2)} kWh`;
            },
          },
        },
      }}
      series={values}
      type="pie"
    />
  );
};
