import React from 'react';
import type { FC } from 'react';
import {
  Box,
  Modal,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Link,
} from '@mui/material';

import type { IVpRecord, IVcRecord } from '@tymlez/platform-api-interfaces';
import { formatDateTime } from '../../../utils/date';
import { Image } from '../../../utils/Image';
import dragonGlass from '../../../../public/dragonglass.png';
import verifiedImage from '../../../../public/verified_white.png';
import { formatNumber } from '../../../utils/number';

interface Props {
  vpRecord: IVpRecord | null;
  handleClose: () => void;
}

export const VcModal: FC<Props> = ({ vpRecord, handleClose }) => {
  return (
    <Modal
      open={!!vpRecord}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          width: '70%',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography id="certificate-title" variant="h6" component="h2">
            CERTIFICATE ID: {vpRecord?.vpId}
          </Typography>
          <Box sx={{ width: 100, mt: 1, ml: 3 }}>
            <Link
              href={vpRecord?.onChainUrl}
              target="_blank"
              title="Hedera on chain transaction details "
            >
              <Image
                src={dragonGlass}
                alt="Hedera on chain transaction details"
              />
            </Link>
          </Box>
        </Box>
        <Box sx={{ width: 100, mt: 2 }}>
          <Image src={verifiedImage} alt="verified" />
        </Box>

        <TableContainer sx={{ mt: 2, maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>WATER PUMPED (L)</TableCell>
                <TableCell>FUEL USED (L)</TableCell>
                <TableCell>DATE AND TIME</TableCell>
                <TableCell>CO2 (kg)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vpRecord &&
                vpRecord?.vcRecords.map((row: IVcRecord) => (
                  <TableRow key={Math.random()}>
                    <TableCell>{row.vcId}</TableCell>
                    <TableCell>
                      {formatNumber(row.mrvWaterPumpAmount || 0)}
                    </TableCell>
                    <TableCell>
                      {formatNumber(row.mrvFuelAmount || 0)}
                    </TableCell>
                    <TableCell>{formatDateTime(row.mrvTimestamp)}</TableCell>
                    <TableCell>
                      {formatNumber(row.mrvCarbonAmount * 1000 || 0)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};
