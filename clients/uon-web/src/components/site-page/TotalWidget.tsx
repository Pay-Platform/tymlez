import type { FC } from 'react';
import React from 'react';
import { Card, Box, Grid, Typography, CircularProgress } from '@mui/material';
import _ from 'lodash';
import { Image } from '../../utils/Image';
import { TrendIcon } from './TrendIcon';
import { WidgetLineChart } from './charts/WidgetLineChart';
import type { IPoint } from '../../api/dashboard/TEMPORARY';

interface Props {
  title?: React.ReactNode | string;
  value?: string;
  unit?: string;
  percentageChange?: number;
  percentageDuration?: string;
  isLoading: boolean;
  isError?: boolean;
  sx?: React.CSSProperties;
  imgSrc?: string;
  showTrend?: boolean;
  data?: IPoint[];
  showMiniChart?: boolean;
}

export const TotalWidget: FC<Props> = ({
  title,
  value,
  unit,
  percentageChange,
  percentageDuration,
  isLoading,
  isError = false,
  sx,
  imgSrc,
  showTrend = true,
  data,
  showMiniChart,
}) => {
  return (
    <Card
      elevation={12}
      sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          px: 3,
          py: 2,
          width: '100%',
          ...sx,
        }}
      >
        {isLoading ? (
          <Box
            sx={{
              justifyContent: 'center',
              display: 'flex',
              width: '100%',
            }}
          >
            <CircularProgress sx={{ m: 2 }} />
          </Box>
        ) : isError ? (
          <Box
            sx={{
              justifyContent: 'center',
              display: 'flex',
              width: '100%',
            }}
          >
            <Typography variant="caption" color="error">
              There is an error requesting this resources. Please try again
              later.
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography color="textSecondary" variant="subtitle2">
              {title}
            </Typography>
            <Grid container>
              <Grid item xs={12} sm={8} xl={9}>
                <Typography
                  color="textSecondary"
                  sx={{ mt: 1 }}
                  variant="subtitle1"
                >
                  <Typography
                    color="textPrimary"
                    variant="h4"
                    component="h5"
                    sx={{
                      mb: 1,
                      mt: 1.5,
                    }}
                  >
                    {/* {_.round(parseInt(value || '0', 10), 2).toLocaleString(
                      'en-US',
                    )}{' '} */}
                    {value}
                    {unit}
                  </Typography>

                  <Typography
                    sx={{ mr: 1 }}
                    color={
                      (percentageChange as number) < 0 ? '#f44336' : '#4caf50'
                    }
                    variant="h6"
                    component="span"
                  >
                    {Math.abs(percentageChange as number)}%
                  </Typography>
                  <TrendIcon
                    showTrend={showTrend}
                    percentageChange={percentageChange}
                  />
                  <Typography color="textSecondary" variant="caption">
                    {percentageDuration}
                  </Typography>
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={4}
                xl={3}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                }}
              >
                {imgSrc && <Image src={imgSrc} width="64px" height="64px" />}
                {showMiniChart && (
                  <WidgetLineChart
                    data={data}
                    percentageChange={percentageChange || 0}
                    isLoading={isLoading}
                  />
                )}
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Card>
  );
};
