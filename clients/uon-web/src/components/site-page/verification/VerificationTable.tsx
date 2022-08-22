import React, { useState } from 'react';
import type { FC } from 'react';
import _ from 'lodash';
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from '@mui/material';
import type { IVpRecord } from '@tymlez/platform-api-interfaces';
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from '@mui/x-data-grid';
import { VerificationQueryForm } from './VerificationQueryForm';
import { VcModal } from './VcModal';
import { formatDateTime } from '../../../utils/date';
import { Image } from '../../../utils/Image';
import hederaImage from '../../../../public/Hedera.png';
import dragonGlass from '../../../../public/dragonglass.png';
import verifiedImage from '../../../../public/verified_white.png';
import { useVerificationData } from '../../../api/verification';

interface Props {
  siteName?: string;
}

export const VerificationTable: FC<Props> = ({ siteName }) => {
  const {
    query,
    setQuery,
    page,
    setPage,
    pageSize,
    setPageSize,
    data,
    isLoading,
  } = useVerificationData(siteName || '', false); // turn this mocked to true if you dont have local guardian running for testing purpose

  const [selectedVp, setSelectedVp] = useState<IVpRecord | null>(null);

  const columns: GridColDef[] = [
    {
      field: 'vpId',
      headerName: 'CERTIFICATE ID',
      headerAlign: 'center',
      flex: 100,
      renderCell: (cellValues) => {
        return (
          <Link href="#" onClick={() => setSelectedVp(cellValues.row)}>
            {cellValues.row.vpId}
          </Link>
        );
      },
    },
    {
      field: 'waterPumpAmount',
      headerName: 'WATER PUMPED (L)',
      headerAlign: 'center',
      type: 'number',
      flex: 70,
      align: 'center',
    },
    {
      field: 'fuelConsumed',
      headerName: 'FUEL USED (L)',
      headerAlign: 'center',
      type: 'number',
      flex: 60,
      align: 'center',
    },
    {
      field: 'timestamp',
      headerName: 'DATE AND TIME MINTED',
      headerAlign: 'center',
      type: 'dateTime',
      flex: 90,
      align: 'center',
      valueFormatter: (params: GridValueFormatterParams) =>
        formatDateTime(params.value as Date),
    },
    {
      field: 'co2Produced',
      headerName: 'CO2 (ton)',
      headerAlign: 'center',
      type: 'number',
      flex: 50,
      align: 'center',
    },
    {
      field: 'onChainUrl',
      headerName: 'VIEW ON-CHAIN',
      headerAlign: 'center',
      flex: 60,
      align: 'center',
      renderCell: (cellValues) => {
        return (
          <Box sx={{ width: '80%', justifyContent: 'center', mt: 1 }}>
            <Link
              href={cellValues.row.onChainUrl}
              target="_blank"
              rel="noopener"
            >
              <Image src={dragonGlass} />
            </Link>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Card elevation={12} sx={{ height: '100%' }}>
        <CardHeader
          sx={{ pb: 1 }}
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
              <Box sx={{ width: 120 }}>
                <Image src={hederaImage} />
              </Box>
            </Box>
          }
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            width: '100%',
            padding: 2,
          }}
        >
          <Stack spacing={1} sx={{ width: '100%', height: 550 }}>
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
                //autoHeight
                rowsPerPageOptions={[25, 50, 100]}
                rows={data?.records ?? []}
                columns={columns}
                pagination
                paginationMode="server"
                rowCount={data?.num ?? 0}
                page={page}
                onPageChange={(newPage) => setPage(newPage)}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
              }}
            >
              <Box sx={{ width: 100 }}>
                <Image src={verifiedImage} />
              </Box>
              <Box sx={{ p: 1 }}>
                <Typography variant="subtitle2">
                  ALL DATA SECURED BY THE TYMLEZ PLATFORM BUILT ON HEDERA
                  HASHGRAPH
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Card>
      <VcModal vpRecord={selectedVp} handleClose={() => setSelectedVp(null)} />
    </>
  );
};
