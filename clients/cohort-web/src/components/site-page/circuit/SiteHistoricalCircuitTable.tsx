import type { FC } from 'react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material';
import { sumBy } from 'lodash';

interface Props {
  data?: { name: string; value: number }[];
}

export const SiteHistoricalCircuitTable: FC<Props> = ({ data }) => {
  const total = sumBy(data, 'value');

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>TENANCY</TableCell>
          <TableCell>CONSUMPTION</TableCell>
          <TableCell>% OF TOTAL CONSUMPTION</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data &&
          data.map((tenancy) => {
            const percent = total > 0 ? (tenancy.value * 100) / total : 0;
            return (
              <TableRow key={tenancy.name}>
                <TableCell>{tenancy.name}</TableCell>
                <TableCell>{tenancy.value.toFixed(4)} kWh</TableCell>
                <TableCell>{percent.toFixed(2)} %</TableCell>
              </TableRow>
            );
          })}
        <TableRow>
          <TableCell>
            <Typography variant="subtitle1">Total</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1">{total.toFixed(4)} kWh</Typography>
          </TableCell>
          <TableCell>
            <Typography variant="subtitle1">100 %</Typography>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
