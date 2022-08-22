import React, { useState } from 'react';
// import React, { lazy, useState } from 'react';
import type { FC } from 'react';
import { Card, CardContent, Grid, Tooltip, Box } from '@mui/material';

import type { ICohortSiteDetail } from '@tymlez/cohort-api-interfaces';

// import Loadable from '../Loadable';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { WeatherWidget } from '../weather/WeatherWidget';
import { OverviewGeneration } from '../overview-page/OverviewGeneration';
import { TotalWidget, useCo2Total } from '../overview-page/TotalWidget';
import { CarbonPieChart } from '../overview-page/CarbonPieChart';
import mapImage from '../../../public/static/cohort_map.png';
import mapImageHover from '../../../public/static/cohort_map_hover.png';
import { Image } from '../../utils/Image';
import buildingsImage from '../../../public/static/cohort_buildings.png';
import { TymlezLogo } from '../TymlezLogo';
// const LoadableOverviewLocation = Loadable(
//   lazy(() => import('../overview-page/OverviewLocation')),
// );

interface IOverviewSiteProps {
  site?: ICohortSiteDetail;
}

export const OverviewSite: FC<IOverviewSiteProps> = (props) => {
  const [mouseOver, setMouseOver] = useState(false);
  const { site } = props;
  const { data: totalData, isLoading: isTotalLoading } = useCo2Total(
    site?.name,
  );

  const handle = useFullScreenHandle();

  return (
    <FullScreen handle={handle}>
      {handle.active && <TymlezLogo />}
      <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
        <Grid item container spacing={2} xs={12} md={8}>
          <Grid item md={12} xs={12} container spacing={3}>
            {/* <Grid item md={12}>
              <Typography color="primary" variant="h5">
                {site?.label}
              </Typography>
            </Grid> */}
            <Grid item md={6} xs={12}>
              <WeatherWidget lat={site?.lat} lon={site?.lng} color="primary" />
            </Grid>
            <Grid item md={6} xs={12}>
              <CarbonPieChart
                produced={totalData?.last24h?.produced}
                saved={totalData?.last24h?.saved}
                isLoading={isTotalLoading}
              />
            </Grid>
          </Grid>
          <Grid item md={12} xs={12} container spacing={3}>
            <Grid item md={6} xs={12}>
              <OverviewGeneration siteName={site?.name} />
            </Grid>
            <Grid item md={3} xs={12}>
              <TotalWidget
                title="24HR CO2e PRODUCED"
                last30d={totalData?.last30d?.produced}
                last24h={totalData?.last24h?.produced}
                isLoading={isTotalLoading}
              />
            </Grid>
            <Grid item md={3} xs={12}>
              <TotalWidget
                title="24HR CO2e ABATED"
                last30d={totalData?.last30d?.saved}
                last24h={totalData?.last24h?.saved}
                isLoading={isTotalLoading}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid item md={4} xs={12}>
          {/* TODO: AddTemporary comment out the map to replace with an image */}
          {/* <LoadableOverviewLocation location={site} variant="outlined" /> */}
          <Card
            elevation={12}
            sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
          >
            <CardContent>
              <Box sx={{ textAlign: 'right' }}>
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
              <Image
                onMouseEnter={() => {
                  setMouseOver(true);
                }}
                onMouseLeave={() => {
                  setMouseOver(false);
                }}
                src={mouseOver ? mapImageHover : mapImage}
                alt="cohort map"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card elevation={12} sx={{ mb: 3 }}>
            <CardContent>
              <Image src={buildingsImage} alt="cohort buildings" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </FullScreen>
  );
};
