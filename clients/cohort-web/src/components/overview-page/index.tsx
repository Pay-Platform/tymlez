import { useEffect } from 'react';
import type { NextPage } from 'next';
import Head from 'next/head';
import NextLink from 'next/link';
import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { ChevronRight as ChevronRightIcon } from '@tymlez/devias-material-kit/dist/icons/chevron-right';
import { gtm } from '@tymlez/devias-material-kit/dist/lib/gtm';
import RolesGuard from '../../utils/auth/components/roles-guard';

import { DashboardLayout } from '../../layout/DashboardLayout';
// import Loadable from '../Loadable';
import { OverviewConsumption } from './OverviewConsumption';
// import { OverviewGeneration } from './OverviewGeneration';
// import { OverviewLocation } from './OverviewLocation';
// import { OverviewSitesGenerationAndConsumption } from './OverviewSitesGenerationAndConsumption';
import { GreenEnergyComplianceChart } from './GreenEnergyComplianceChart';
import { TopConsumersTable } from './TopConsumersTable';
// import { OverviewMeters } from './OverviewMeters';
import { WeatherWidget } from '../weather/WeatherWidget';
import { useDashboardOverview } from './api/useDashboardOverview';

// const LoadableOverviewLocation = Loadable(
//   lazy(() => import('./OverviewLocation')),
// );

export const OverviewPage: NextPage = () => {
  useEffect(() => {
    gtm.push({ event: 'page_view' });
  }, []);

  const { data: dashboard, isLoading, isError, error } = useDashboardOverview();

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return (
      <span>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </span>
    );
  }

  return (
    <>
      <Head>
        <title>Dashboard: Overview</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid
              alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
                <Typography color="textPrimary" variant="h5">
                  Dashboard
                </Typography>
                <Breadcrumbs
                  aria-label="breadcrumb"
                  separator={<ChevronRightIcon fontSize="small" />}
                  sx={{ mt: 1 }}
                >
                  <NextLink href="/site">
                    <Button component="a" color="primary" variant="text">
                      Cohort
                    </Button>
                  </NextLink>
                  <Typography color="textSecondary" variant="subtitle2">
                    Dashboard
                  </Typography>
                </Breadcrumbs>
              </Grid>
            </Grid>
            <Grid item md={3} xs={12}>
              {/* <OverviewGeneration siteName={dashboard?.} /> */}
            </Grid>
            <Grid item md={3} xs={12}>
              <OverviewConsumption consumed24={dashboard?.consumed24h} />
            </Grid>
            <Grid item md={3} xs={12}>
              <WeatherWidget
                city="Sydney"
                country="Australia"
                sx={{ height: '100%' }}
              />
            </Grid>
            {/* <Grid item md={8} xs={12}>
              <OverviewSitesGenerationAndConsumption
                overview24={dashboard?.overview24h}
              />
            </Grid> */}
            {/* <Grid item md={4} xs={12}>
              <LoadableOverviewLocation location={dashboard?.location} />
            </Grid> */}
            <Grid item md={8} xs={12}>
              <TopConsumersTable style={{ height: '100%' }} />
            </Grid>
            <Grid item md={4} xs={12}>
              <GreenEnergyComplianceChart />
            </Grid>
            {/* <Grid item md={12} xs={12}>
              <OverviewMeters meters={dashboard?.meters ?? []} />
            </Grid> */}
          </Grid>
        </Container>
      </Box>
    </>
  );
};

OverviewPage.getLayout = (page) => (
  <RolesGuard roles={['admin']}>
    <DashboardLayout>{page}</DashboardLayout>
  </RolesGuard>
);
