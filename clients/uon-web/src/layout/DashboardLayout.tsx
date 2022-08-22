// import { useState } from 'react';
import type { FC, ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';
import { DashboardNavbar } from './DashboardNavbar';
// import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  paddingTop: 64,
  [theme.breakpoints.up('lg')]: {
    // paddingLeft: 280,
  },
}));

export const DashboardLayout: FC<DashboardLayoutProps> = (props) => {
  const { children } = props;
  // const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  return (
    <>
      <DashboardLayoutRoot>
        <Box
          sx={{
            display: 'flex',
            flex: '1 1 auto',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </DashboardLayoutRoot>
      <DashboardNavbar />
      {/* <DashboardNavbar onOpenSidebar={(): void => setIsSidebarOpen(true)} /> */}
      {/* <DashboardSidebar
        onClose={(): void => setIsSidebarOpen(false)}
        open={isSidebarOpen}
      /> */}
    </>
  );
};
