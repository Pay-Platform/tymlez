import type { NextPage } from 'next';
import React, { useEffect, useRef } from 'react';
import { Box, Grid } from '@mui/material';
import Head from 'next/head';
import { AuthGuard } from '../../utils/auth/components/auth-guard';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { DisplaySite } from '../tv-display-page/DisplaySite';
import { useSiteDetail } from '../site-page/api/useSiteDetail';

export const DisplayPage: NextPage = () => {
  const { data: siteInfo, isLoading, isError, error } = useSiteDetail();

  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      window.location.pathname = '/display';
    }, 15 * 60 * 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
        <title>Cohort Display</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
          px: '8%',
        }}
      >
        <Grid container>
          <Grid item md={12} xs={12}>
            <DisplaySite site={siteInfo} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

DisplayPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);
