import type { NextPage } from 'next';
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import { AuthGuard } from '../../utils/auth/components/auth-guard';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { TotalWidget } from './TotalWidget';
import mapImageHover from '../../../public/static/uon_map.png';
import { Image } from '../../utils/Image';
import { VerificationTable } from './verification';
import { EnergyMixChart } from './charts/EnergyMixChart';
import {
  use7DaysTotalCarbon,
  useCarbonFromTruckedDiesel,
  useCO2perLWaterPumped,
  use7DaysTotalWaterPumped,
  useAvailableStoredEnergy,
  use7DaysGreenGeneration,
  use7DaysFossilFuelGeneration,
} from '../../api/dashboard';
import { CarbonEmissionChart } from './charts/CarbonEmissionChart';

export const SitePage: NextPage = () => {
  const {
    data: data7DaysTotalCarbon,
    isLoading: is7DaysTotalCarbonLoading,
    isError: isError1,
  } = use7DaysTotalCarbon();
  const {
    data: dataCarbonFromTruckedDiesel,
    isLoading: isCarbonFromTruckedDieselLoading,
    isError: isError2,
  } = useCarbonFromTruckedDiesel();
  const {
    data: dataCO2perLWaterPumped,
    isLoading: isCO2perLWaterPumpedLoading,
    isError: isError3,
  } = useCO2perLWaterPumped();
  const {
    data: data7DaysTotalWaterPumped,
    isLoading: is7DaysTotalWaterPumpedLoading,
    isError: isError4,
  } = use7DaysTotalWaterPumped();
  const {
    data: dataAvailableStoredEnergy,
    isLoading: isAvailableStoredEnergyLoading,
    isError: isError5,
  } = useAvailableStoredEnergy();
  const {
    data: data7DaysGreenGeneration,
    isLoading: is7DaysGreenGenerationLoading,
    isError: isError6,
  } = use7DaysGreenGeneration();
  const {
    data: data7DaysFossilFuelGeneration,
    isLoading: is7DaysFossilFuelGenerationLoading,
    isError: isError7,
  } = use7DaysFossilFuelGeneration();

  return (
    <>
      <Head>
        <title>TYMLEZ Carbon Footprint for Uon</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1400 }}>
          <Grid item container md={12} xs={12} columnSpacing={6} rowSpacing={3}>
            <Grid item container xs={12} md={4} lg={4} spacing={3}>
              <Grid item xs={12}>
                <TotalWidget
                  {...data7DaysTotalCarbon}
                  isLoading={is7DaysTotalCarbonLoading}
                  isError={isError1}
                  showMiniChart
                />
              </Grid>
              <Grid item xs={12}>
                <TotalWidget
                  {...dataCarbonFromTruckedDiesel}
                  showTrend={false}
                  isLoading={isCarbonFromTruckedDieselLoading}
                  isError={isError2}
                  imgSrc="/static/icons/truck.svg"
                />
              </Grid>
            </Grid>
            <Grid item container xs={12} md={4} lg={4} spacing={3}>
              <Grid item xs={12}>
                <TotalWidget
                  {...dataCO2perLWaterPumped}
                  isLoading={isCO2perLWaterPumpedLoading}
                  isError={isError3}
                  showMiniChart
                />
              </Grid>
              <Grid item xs={12}>
                <TotalWidget
                  {...data7DaysTotalWaterPumped}
                  isLoading={is7DaysTotalWaterPumpedLoading}
                  isError={isError4}
                  imgSrc="/static/icons/waterdrop.svg"
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
              <Card
                elevation={12}
                sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
              >
                <CardContent>
                  <Typography
                    color="textSecondary"
                    variant="subtitle2"
                    sx={{ mb: 1 }}
                  >
                    Sites
                  </Typography>
                  <Image src={mapImageHover} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item container xs={12} rowSpacing={3} columnSpacing={6}>
              <Grid item xs={12} md={4}>
                <TotalWidget
                  {...data7DaysFossilFuelGeneration}
                  isLoading={is7DaysFossilFuelGenerationLoading}
                  isError={isError7}
                  showMiniChart
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TotalWidget
                  {...data7DaysGreenGeneration}
                  isLoading={is7DaysGreenGenerationLoading}
                  isError={isError6}
                  showMiniChart
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TotalWidget
                  {...dataAvailableStoredEnergy}
                  showTrend={false}
                  isLoading={isAvailableStoredEnergyLoading}
                  isError={isError5}
                  imgSrc="/static/icons/echo-battery.svg"
                />
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <EnergyMixChart />
            </Grid>
            <Grid item xs={12}>
              <CarbonEmissionChart />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <VerificationTable siteName="Uon" />
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
