import type { NextPage } from 'next';
import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import Head from 'next/head';
import HomeIcon from '@mui/icons-material/Home';
import { AuthGuard } from '../../utils/auth/components/auth-guard';
import { DashboardLayout } from '../../layout/DashboardLayout';
import { Image } from '../../utils/Image';
import tymlezLogo from '../../../public/tymlezlogolime.png';
import verifiedWhite from '../../../public/static/report/verified-white.png';
import saiGlobalLogo from '../../../public/SAI-Global.png';
import { CarbonAuditTable } from './CarbonAuditTable';
import { CarbonReportChartContainer } from './CarbonReportChart';
import {
  use7DaysFossilFuelGeneration,
  use7DaysTotalWaterPumped,
  use7DaysSolarGeneration,
  useCarbonFromTruckedDiesel,
  useCarbonReport,
  useCarbonAudit,
} from '../../api/report';
import { TotalWidget } from '../site-page/TotalWidget';
import mapImageHover from '../../../public/static/uon_map.png';
import { formatDateWithoutTimezone } from '../../utils/date';

export const ReportPage: NextPage = () => {
  const {
    data: data7DaysFossilFuelGeneration,
    isLoading: is7DaysFossilFuelGenerationLoading,
    isError: isError7,
  } = use7DaysFossilFuelGeneration();
  const {
    data: dataCarbonFromTruckedDiesel,
    isLoading: isCarbonFromTruckedDieselLoading,
    isError: isError2,
  } = useCarbonFromTruckedDiesel();
  const {
    data: data7DaysGreenGeneration,
    isLoading: is7DaysGreenGenerationLoading,
    isError: isError6,
  } = use7DaysSolarGeneration();
  const {
    data: data7DaysTotalWaterPumped,
    isLoading: is7DaysTotalWaterPumpedLoading,
    isError: isError4,
  } = use7DaysTotalWaterPumped();

  const carbonReportData = useCarbonReport();
  const carbonAuditData = useCarbonAudit();
  // const today = formatDateWithoutTimezone(new Date());
  // const lastWeek = formatDateWithoutTimezone(
  //   new Date().getTime() - 7 * 24 * 60 * 60 * 1000,
  // );
  const startDate = formatDateWithoutTimezone(new Date('2022-03-30'));
  const endDate = formatDateWithoutTimezone(new Date('2022-04-02'));
  return (
    <>
      <Head>
        <title>UON Site Report</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
        }}
      >
        <Container maxWidth={false} sx={{ maxWidth: 1400 }}>
          <Grid container spacing={3}>
            <Grid
              item
              container
              xs={12}
              sx={{ my: 6 }}
              justifyContent="space-between"
            >
              <Grid item xs={12} sx={{ mb: 4 }} className="pageDisplayNone">
                <Button href="/" variant="outlined" startIcon={<HomeIcon />}>
                  Back to Home
                </Button>
              </Grid>
              <Grid item xs={5} sm={4} md={3}>
                <Image src={tymlezLogo} />
              </Grid>
              <Grid item xs={5} sm={3} md={2}>
                <Image src={verifiedWhite} />
              </Grid>
            </Grid>
            <Grid item container xs={12}>
              <Typography color="textPrimary" variant="h6" sx={{ mb: 1 }}>
                Site Performance reporting for period {startDate} - {endDate}
              </Typography>
            </Grid>
            <Grid item container xs={12}>
              <Typography
                color="textPrimary"
                sx={{ mb: 1 }}
                className="pageDisplayNone"
              >
                To print correctly, please use the latest version of Google
                Chrome browser and press Ctrl + P.
              </Typography>
            </Grid>
            <Grid
              item
              container
              md={12}
              xs={12}
              columnSpacing={6}
              rowSpacing={3}
            >
              <Grid item container xs={12} md={4} lg={4} spacing={3}>
                <Grid item xs={12}>
                  <TotalWidget
                    {...data7DaysFossilFuelGeneration}
                    isLoading={is7DaysFossilFuelGenerationLoading}
                    isError={isError7}
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
              <Grid item container xs={12} md={4} lg={4} spacing={3}>
                <Grid item xs={12} className="mt180">
                  <TotalWidget
                    {...data7DaysGreenGeneration}
                    isLoading={is7DaysGreenGenerationLoading}
                    isError={isError6}
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
            </Grid>
          </Grid>
          <Box sx={{ mt: 3 }} className="pageBreak">
            <CarbonReportChartContainer hookReturn={carbonReportData} />
          </Box>
          <Box sx={{ mt: 3 }} className="pageBreak">
            <CarbonAuditTable hookReturn={carbonAuditData} />
            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
              <Grid item xs={5} sm={5} md={5}>
                <Image src={saiGlobalLogo} layout="responsive" />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
};

ReportPage.getLayout = (page) => (
  <AuthGuard>
    <DashboardLayout>{page}</DashboardLayout>
  </AuthGuard>
);
