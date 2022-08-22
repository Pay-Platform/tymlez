import type { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  Typography,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from '@mui/material';

import NextLink from 'next/link';
import { SeverityPill } from '@tymlez/devias-material-kit/dist/components/severity-pill';

export const OverviewMeters: FC<IOverviewMetersProp> = ({ meters }) => {
  return (
    <Card elevation={12}>
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
              METERS
            </Typography>
          </Box>
        }
      />
      <Table>
        <TableBody>
          {meters?.map((item) => (
            <TableRow
              key={item.title}
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
                    {item.title}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                Consumption{' '}
                <Typography color="error">{item.consumption} MWh</Typography>
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                Generation{' '}
                <Typography color="secondary">{item.generation} MWh</Typography>
              </TableCell>
              <TableCell style={{ textAlign: 'center' }}>
                <SeverityPill
                  color={(item.status === 'online' && 'success') || 'error'}
                >
                  Status: {item.status}
                </SeverityPill>
              </TableCell>
              <TableCell style={{ textAlign: 'right' }}>
                <NextLink href={`/meter/${item.meterId}`} passHref>
                  <Button component="a" color="primary" variant="contained">
                    Details
                  </Button>
                </NextLink>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export interface IOverviewMetersProp {
  meters: IDashboardMeter[];
}

export interface IDashboardMeter {
  title: string;
  consumption: number;
  generation: number;
  status: string;
  meterId: string;
}
