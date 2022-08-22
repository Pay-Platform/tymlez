import React, { useState } from 'react';
import type { FC } from 'react';
import _ from 'lodash';
import axios from 'axios';
import { useQuery } from 'react-query';
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import type {
  IVerification,
  VerificationPeriod,
  gCo2ePerkWh,
  kWh,
  IVcRecord,
  IVpRecord,
} from '@tymlez/platform-api-interfaces';
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import {
  VerificationQuery,
  VerificationQueryForm,
} from './VerificationQueryForm';
import { VcModal } from './VcModal';
import { formatDateTime } from '../../../utils/date';

type VerificationRow = {
  id: number;
  vpId: string;
  vcRecords: Array<IVcRecord>;
  energyValue: kWh;
  timestamp: Date;
  co2Produced: gCo2ePerkWh;
};

type Verification = {
  records: VerificationRow[];
  num: number;
};

async function fetchSiteVerification(
  siteName: string | null,
  period: VerificationPeriod,
  page: number,
  pageSize: number,
): Promise<Verification> {
  const params = { siteName, period, page, pageSize };
  const { data } = await axios.get<IVerification>(
    `${process.env.NEXT_PUBLIC_PLATFORM_API_URL}/meters/verification`,
    { params },
  );
  return {
    num: data.num,
    records: data.records.map((r, id) => ({
      id,
      timestamp: new Date(r.timestamp),
      ..._.omit(r, ['timestamp']),
    })),
  };
}

interface Props {
  siteName?: string;
}

export const VerificationTable: FC<Props> = ({ siteName }) => {
  const [query, setQuery] = useState<VerificationQuery>({
    period: 'all',
  });
  const [selectedVp, setSelectedVp] = useState<IVpRecord | null>(null);

  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(25);

  const { data, isLoading } = useQuery<Verification>(
    ['siteVerification', siteName, query.period, page, pageSize],
    () => fetchSiteVerification(siteName || null, query.period, page, pageSize),
    {
      staleTime: Infinity,
    },
  );

  const columns: GridColDef[] = [
    {
      field: 'vpId',
      headerName: 'VP ID',
      flex: 150,
      renderCell: (cellValues) => {
        return (
          <Link onClick={() => setSelectedVp(cellValues.row)}>
            {cellValues.row.vpId}
          </Link>
        );
      },
    },
    {
      field: 'energyValue',
      headerName: 'ENERGY VALUE (kWh)',
      type: 'number',
      flex: 200,
    },
    {
      field: 'timestamp',
      headerName: 'DATE AND TIME FOR MINTING',
      type: 'dateTime',
      flex: 250,
      valueFormatter: (params: GridValueFormatterParams) =>
        formatDateTime(params.value as Date),
    },
    {
      field: 'co2Produced',
      headerName: 'CO2 PRODUCED (ton)',
      type: 'number',
      flex: 200,
    },
  ];

  return (
    <>
      <Card elevation={12} sx={{ height: '90%' }}>
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
              <Typography color="textPrimary" variant="h6">
                VERIFICATION
              </Typography>
            </Box>
          }
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            padding: 3,
          }}
        >
          <Stack spacing={2} sx={{ width: '100%' }}>
            <VerificationQueryForm query={query} onUpdateQuery={setQuery} />
            {isLoading ? (
              <Box
                sx={{
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <CircularProgress sx={{ m: 2 }} />
              </Box>
            ) : (
              <DataGrid
                autoHeight
                rows={data?.records ?? []}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={data?.num ?? 0}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              />
            )}
          </Stack>
        </Box>
      </Card>
      <VcModal vpRecord={selectedVp} handleClose={() => setSelectedVp(null)} />
    </>
  );
};
