import * as React from 'react';
import { Box, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CustomizedIntallerTable } from './InstallerTable';
import { AddInstallerModal } from './AddInstallerModal';
import { InstallerSummary } from './InstallerSummary';

export const InstallerPage = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [refreshTime, setRefreshTime] = React.useState(new Date());

  const onInstallerModelClose = () => {
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
        <InstallerSummary refreshTime={refreshTime} />
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
      <CustomizedIntallerTable refreshTime={refreshTime} />

      <AddInstallerModal open={showModal} onClose={onInstallerModelClose} />
    </>
  );
};
