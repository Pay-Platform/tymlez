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
} from '@mui/material';
import type { IVpRecord, IVcRecord } from '@tymlez/platform-api-interfaces';
import { formatDateTime } from '../../../utils/date';

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
        <Typography id="modal-modal-title" variant="h6" component="h2">
          VP ID: {vpRecord?.vpId}
        </Typography>
        <TableContainer sx={{ mt: 2, maxHeight: 450 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Energy Amount (kWh)</TableCell>
                <TableCell>Carbon Amount (kg CO2e)</TableCell>
                <TableCell>Date Time</TableCell>
                <TableCell>Duration (ms)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {vpRecord &&
                vpRecord?.vcRecords.map((row: IVcRecord) => (
                  <TableRow key={Math.random()}>
                    <TableCell>{row.mrvEnergyAmount}</TableCell>
                    <TableCell>{row.mrvCarbonAmount * 1000}</TableCell>
                    <TableCell>{formatDateTime(row.mrvTimestamp)}</TableCell>
                    <TableCell>{row.mrvDuration}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Modal>
  );
};
