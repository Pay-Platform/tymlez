import type { FC } from 'react';
import { Card, Box, Grid, Typography } from '@mui/material';
import _ from 'lodash';
import React from 'react';
import { Image } from '../../utils/Image';

interface Props {
  title: React.ReactNode | string;
  current?: number;
  last24h?: number;
  isLoading: boolean;
  sx?: React.CSSProperties;
  imgSrc?: string;
}

export const EnergyWidget: FC<Props> = ({
  title,
  current,
  last24h,
  isLoading,
  imgSrc,
  sx,
}) => {
  return (
    <Card
      elevation={12}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          ...sx,
        }}
      >
        {isLoading ? (
          'Loading...'
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography color="primary" variant="subtitle2">
              {title}
            </Typography>
            <Grid container>
              <Grid item xs={12} sm={8} md={12} xl={9}>
                <Typography
                  color="textPrimary"
                  sx={{ mt: 1 }}
                  variant="subtitle1"
                >
                  <Typography color="textPrimary" variant="h5">
                    <div>
                      {_.round(current ?? 0, 2).toLocaleString('en-US')} kWh
                    </div>
                  </Typography>
                  <Typography color="textSecondary" variant="caption">
                    <div />
                    last 24 hours
                  </Typography>
                  <Typography color="textSecondary" variant="h6">
                    {_.round(last24h ?? 0, 2).toLocaleString('en-US')} kWh
                  </Typography>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                md={12}
                xl={3}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}
              >
                {imgSrc && <Image src={imgSrc} width="50px" height="50px" />}
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  );
};
