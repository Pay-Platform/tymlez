import type { NextPage } from 'next';
import React, { SyntheticEvent, useState } from 'react';
import {
  Box,
  // Breadcrumbs,
  // Button,
  Container,
  Grid,
  // Typography,
  Tabs,
  Tab,
  Card,
  // CardContent,
} from '@mui/material';
import Head from 'next/head';
// import { ChevronRight as ChevronRightIcon } from '@tymlez/devias-material-kit/dist/icons/chevron-right';
import { AuthGuard } from '../../utils/auth/components/auth-guard';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { OverviewSite } from './OverviewSite';
import { SiteGeneration } from './SiteGeneration';
import { SiteConsumption } from './SiteConsumption';
import { SiteCarbon } from './SiteCarbon';
import { SiteCircuit } from './SiteCircuit';
import { useSiteDetail } from './api/useSiteDetail';
import { SiteVerification } from './SiteVerification';

type EnergyTab =
  | 'generation'
  | 'consumption'
  | 'circuit'
  | 'storage'
  | 'verification'
  | 'carbon';

export const SitePage: NextPage = () => {
  const { data: siteInfo, isLoading, isError, error } = useSiteDetail();
  const [currentTab, updateCurrentTab] = useState<EnergyTab>('circuit');
  const handleTabsChange = (_event: SyntheticEvent, value: unknown): void => {
    updateCurrentTab(value as EnergyTab);
  };
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
        <title>Cohort</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="lg">
          {/* <Typography variant="h6">Site Details</Typography> */}
          <Grid container>
            {/* <Grid
              alignItems="center"
              container
              justifyContent="space-between"
              spacing={3}
              item
              xs={12}
            >
              <Grid item>
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
                    Site Details
                  </Typography>
                </Breadcrumbs>
              </Grid>
            </Grid> */}
            <Grid item md={12} xs={12}>
              <OverviewSite site={siteInfo} />
            </Grid>
          </Grid>

          <Box
            sx={{
              mt: 3,
            }}
          >
            <Grid container>
              <Grid item md={12}>
                <Card elevation={12}>
                  <Tabs
                    indicatorColor="primary"
                    onChange={handleTabsChange}
                    scrollButtons="auto"
                    textColor="primary"
                    value={currentTab}
                    variant="fullWidth"
                    centered
                  >
                    <Tab key="circuit" label="Tenancy" value="circuit" />
                    <Tab
                      key="consumption"
                      label="Consumption"
                      value="consumption"
                    />
                    <Tab
                      key="generation"
                      label="Generation"
                      value="generation"
                    />
                    <Tab key="carbon" label="Carbon Emissions" value="carbon" />
                    <Tab
                      key="verification"
                      label="Verification"
                      value="verification"
                    />
                  </Tabs>
                </Card>
                <Box sx={{ py: 3 }}>
                  {currentTab === 'generation' && (
                    <SiteGeneration siteName={siteInfo?.name} />
                  )}
                  {currentTab === 'consumption' && (
                    <SiteConsumption
                      siteName={siteInfo?.name}
                      meters={siteInfo?.meters ?? []}
                    />
                  )}
                  {currentTab === 'circuit' &&
                    (siteInfo ? (
                      <SiteCircuit siteName={siteInfo.name} />
                    ) : (
                      <>Loading...</>
                    ))}
                  {currentTab === 'verification' &&
                    (siteInfo ? (
                      <SiteVerification siteName={siteInfo.name} />
                    ) : (
                      <>Loading...</>
                    ))}
                  {currentTab === 'carbon' && (
                    <SiteCarbon siteName={siteInfo?.name} />
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

SitePage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);
