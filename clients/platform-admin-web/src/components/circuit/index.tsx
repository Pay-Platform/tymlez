import * as React from 'react';
import type { NextPage } from 'next';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { AddCircuitModal } from './AddCircuitModal';
import { CustomizedCircuitTable } from './CircuitTable';

export const CircuitPage: NextPage = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [refreshTime, setRefreshTime] = React.useState(new Date());

  const onCircuitModelClose = () => {
    setShowModal(false);
    setRefreshTime(new Date());
  };

  return (
    <>
      <Box
        sx={{
          textAlign: 'center',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(200px, 1fr))',
          columnGap: 5,
          marginTop: 8,
        }}
      >
        <Box sx={{ marginTop: 8 }} style={{ position: 'relative' }}>
          <Button
            color="primary"
            sx={{ textTransform: 'uppercase' }}
            fullWidth
            size="large"
            style={{ position: 'absolute', right: '5%', bottom: '5%' }}
            variant="contained"
            onClick={() => {
              setShowModal(true);
            }}
            startIcon={<AddIcon />}
          >
            Add new
          </Button>
        </Box>
      </Box>
      <CustomizedCircuitTable refreshTime={refreshTime} />

      <AddCircuitModal open={showModal} onClose={onCircuitModelClose} />
    </>
  );
};
