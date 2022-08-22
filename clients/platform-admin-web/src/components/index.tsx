import * as React from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import { Grid } from '@mui/material';
import ChaletIcon from '@mui/icons-material/Chalet';
import GroupIcon from '@mui/icons-material/Group';
import { DashboardLayout } from '../layout/DashboardLayout';
import RolesGuard from '../utils/auth/components/roles-guard';
import { SideBar } from './SideBar';
import { InstallerPage } from './installer';
import { ChannelPage } from './channel';
import { SitePage } from './site';
import { MeterPage } from './meter';
import { CircuitPage } from './circuit';

export const AdminPage: NextPage = () => {
  const [tab, setTab] = React.useState(0);
  const tabList = [
    {
      id: 0,
      tabName: 'Installers',
      icon: <GroupIcon fontSize="small" />,
    },
    {
      id: 1,
      tabName: 'Channels',
      icon: <GroupIcon fontSize="small" />,
    },
    {
      id: 2,
      tabName: 'Circuits',
      icon: <GroupIcon fontSize="small" />,
    },
    {
      id: 3,
      tabName: 'Meters',
      icon: <GroupIcon fontSize="small" />,
    },
    {
      id: 4,
      tabName: 'Sites',
      icon: <GroupIcon fontSize="small" />,
    },
    {
      id: 5,
      tabName: 'Carbon Data',
      icon: <ChaletIcon fontSize="small" />,
    },
  ];
  return (
    <>
      <Head key="1">
        <title>Admin | Tymlez-UI</title>
      </Head>

      <Grid
        container
        spacing={5}
        style={{
          minWidth: 'lg',
        }}
      >
        <Grid
          item
          xs={2.5}
          sx={{
            bgcolor: 'background.paper',
            maxHeight: '100%',
            maxWidth: 'md',
          }}
        >
          <SideBar data={tabList} tab={tab} setTab={(item) => setTab(item)} />
        </Grid>

        <Grid
          item
          xs={5}
          sx={{
            bgcolor: 'background.default',
            maxHeight: '100%',
          }}
        >
          {tab === 0 && <InstallerPage />}
          {tab === 1 && <ChannelPage />}
          {tab === 2 && <CircuitPage />}
          {tab === 3 && <MeterPage />}
          {tab === 4 && <SitePage />}
        </Grid>
      </Grid>
    </>
  );
};
AdminPage.getLayout = (page) => (
  <RolesGuard roles={['admin']}>
    <DashboardLayout>{page}</DashboardLayout>
  </RolesGuard>
);
