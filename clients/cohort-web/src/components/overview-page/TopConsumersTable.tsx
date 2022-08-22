import type { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
// import { useConfig } from '~features/config';
// import useAuth from '../../../../api/auth';
// import { useTopConsumers } from '../../api/useConsumption';

const data = [
  {
    type: 'Lighting',
    amount: 100,
    greenPercentage: 20,
  },
  {
    type: 'Fridges',
    amount: 90,
    greenPercentage: 50,
  },
  {
    type: 'Aircon',
    amount: 80,
    greenPercentage: 75,
  },
  {
    type: 'Computers',
    amount: 70,
    greenPercentage: 90,
  },
];

interface Props {
  style: React.CSSProperties;
}
export const TopConsumersTable: FC<Props> = ({ style }) => {
  // const config = useConfig();
  // const auth = useAuth(config);
  // const topConsumers = useTopConsumers(config, auth);
  return (
    <Card style={style}>
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
              TOP CONSUMERS
            </Typography>
          </Box>
        }
      />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>% Green</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((item) => (
            <TableRow
              key={item.type}
              sx={{
                '&:last-child td': {
                  border: 0,
                },
              }}
            >
              <TableCell>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <Typography color="textPrimary" sx={{ ml: 2 }} variant="h6">
                    {item.type}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{item.amount} kWh</TableCell>
              <TableCell>{item.greenPercentage.toFixed(0)} %</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};
