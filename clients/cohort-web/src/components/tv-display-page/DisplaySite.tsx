import React, { useState } from 'react';
// import React, { lazy, useState } from 'react';
import type { FC } from 'react';
import {
  // Box,
  Card,
  CardContent,
  Grid,
  // Tooltip
} from '@mui/material';

import type { ICohortSiteDetail } from '@tymlez/cohort-api-interfaces';
import type { ITimestampMsec } from '@tymlez/platform-api-interfaces';

// import Loadable from '../Loadable';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
// import FullscreenIcon from '@mui/icons-material/Fullscreen';
// import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { WeatherWidget } from '../weather/WeatherWidget';
import { OverviewGeneration } from '../overview-page/OverviewGeneration';
import { TotalWidget, useCo2Total } from '../overview-page/TotalWidget';
import { CarbonPieChart } from '../overview-page/CarbonPieChart';
import { Image } from '../../utils/Image';
import buildingsImage from '../../../public/static/cohort_buildings.png';
import { TymlezLogo } from '../TymlezLogo';
import { SiteHistoricalCircuitPieChartWidget } from './SiteHistoricalCircuitPieChartWidget';
import { CO2OutputWidget } from './CO2OutputWidget';
import { EnergyWidget } from './EnergyWidget';
import {
  useConsumptionRealtime,
  useConsumptionHistory,
} from '../site-page/api/useConsumptionData';
import type { HistoryQuery } from '../HistoryQueryForm';
import { useGenerationForecast } from '../site-page/api/useGenerationForecast';

interface IDisplaySiteProps {
  site?: ICohortSiteDetail;
}

export const DisplaySite: FC<IDisplaySiteProps> = (props) => {
  const { site } = props;
  const siteName = site?.name;
  const { data: totalData, isLoading: isTotalLoading } = useCo2Total(siteName);
  const { data: realtimeConsumption, isLoading: isRealtimeConsumptionLoading } =
    useConsumptionRealtime(siteName);
  const currentConsumption =
    realtimeConsumption?.[realtimeConsumption.length - 1]?.value || 0;

  const yesterday = Date.now() - 60 * 60 * 24 * 1000;
  const [historyQuery] = useState<HistoryQuery>({
    dateRange: [new Date(yesterday), new Date()],
  });

  const { data: consumption24h, isLoading: isConsumption24hLoading } =
    useConsumptionHistory(
      siteName,
      historyQuery.dateRange[0]?.getTime() as ITimestampMsec,
      historyQuery.dateRange[1]?.getTime() as ITimestampMsec,
    );
  const totalConsumptionNumber = consumption24h
    ? consumption24h.reduce((acc, curr) => acc + curr.value, 0)
    : 0;

  const { data: generation24h, isLoading: isGeneration24hLoading } =
    useGenerationForecast(siteName, 'daily', 'history');
  const { data: realtimeGeneration, isLoading: isRealtimeGenerationLoading } =
    useGenerationForecast(siteName, 'hourly', 'forecast');
  const generation24hData = generation24h?.[0]?.data.slice(-1)?.[0]?.y || 0;
  const realtimeGenerationData =
    realtimeGeneration?.[0]?.data.slice(-1)?.[0]?.y || 0;

  const handle = useFullScreenHandle();
  return (
    <FullScreen handle={handle}>
      {handle.active && <TymlezLogo />}
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        <Grid
          item
          container
          spacing={3}
          xs={12}
          md={12}
          sx={{ pt: '0!important' }}
        >
          {/* <Grid item xs={12} md={12} sx={{ pt: "0!important" }}>
            <Box sx={{ textAlign: 'right', margin: 3 }}>
              {handle.active ? (
                <Tooltip title="Exit fullscreen">
                  <FullscreenExitIcon
                    fontSize="small"
                    onClick={handle.exit}
                  />
                </Tooltip>
              ) : (
                <Tooltip title="Fullscreen">
                  <FullscreenIcon fontSize="small" onClick={handle.enter} />
                </Tooltip>
              )}
            </Box>
          </Grid> */}
          <Grid
            item
            md={12}
            xs={12}
            container
            spacing={3}
            sx={{ pt: '0!important' }}
          >
            <Grid item md={4} xs={12}>
              <WeatherWidget lat={site?.lat} lon={site?.lng} color="primary" />
            </Grid>
            <Grid item md={4} xs={12}>
              <CarbonPieChart
                produced={totalData?.last24h?.produced}
                saved={totalData?.last24h?.saved}
                isLoading={isTotalLoading}
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <Card
                elevation={12}
                sx={{
                  mb: 3,
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CardContent>
                  <Image src={buildingsImage} alt="cohort buildings" />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid item md={12} xs={12} container spacing={3}>
            <Grid item md={2} xs={12}>
              <TotalWidget
                title={
                  <>
                    24HR CO2e <br />
                    PRODUCED
                  </>
                }
                last30d={totalData?.last30d?.produced}
                last24h={totalData?.last24h?.produced}
                isLoading={isTotalLoading}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <TotalWidget
                title={
                  <>
                    24HR CO2e <br />
                    ABATED
                  </>
                }
                last30d={totalData?.last30d?.saved}
                last24h={totalData?.last24h?.saved}
                isLoading={isTotalLoading}
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <EnergyWidget
                title={
                  <>
                    CURRENT <br />
                    CONSUMPTION
                  </>
                }
                last24h={totalConsumptionNumber}
                current={currentConsumption}
                isLoading={
                  isRealtimeConsumptionLoading || isConsumption24hLoading
                }
                imgSrc="/static/icons/031-eco_light.svg"
              />
            </Grid>
            <Grid item md={2} xs={12}>
              <EnergyWidget
                title={
                  <>
                    CURRENT <br />
                    GENERATION (forecast)
                  </>
                }
                last24h={generation24hData}
                current={realtimeGenerationData}
                isLoading={
                  isGeneration24hLoading || isRealtimeGenerationLoading
                }
                imgSrc="/static/icons/006-solar_panel.svg"
              />
            </Grid>
            <Grid item md={4} xs={12}>
              <OverviewGeneration siteName={siteName} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} container spacing={3}>
          <Grid item md={8} xs={12}>
            <CO2OutputWidget />
          </Grid>
          <Grid item md={4} xs={12}>
            <SiteHistoricalCircuitPieChartWidget siteName={siteName} />
          </Grid>
        </Grid>
      </Grid>
    </FullScreen>
  );
};
