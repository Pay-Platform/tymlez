import type { FC } from 'react';
import { useQuery } from 'react-query';
import { Card, Box, Typography } from '@mui/material';
import axios from 'axios';
import type { ISiteEmissionTotal } from '@tymlez/platform-api-interfaces';
import _ from 'lodash';

export function useCo2Total(siteName = 'main') {
  return useQuery(
    ['carbon-total', siteName],
    async () => {
      if (!siteName) {
        return;
      }
      const { data: dataRaw } = await axios.get<ISiteEmissionTotal>(
        `${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/carbon/total`,
        { params: { siteName } },
      );
      return dataRaw;
    },
    { refetchOnWindowFocus: false },
  );
}

interface Props {
  title: React.ReactNode | string;
  last30d?: number;
  last24h?: number;
  isLoading: boolean;
  sx?: React.CSSProperties;
}

export const TotalWidget: FC<Props> = ({
  title,
  last30d,
  last24h,
  isLoading,
  sx,
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
          ...sx,
        }}
      >
        {isLoading ? (
          'Loading...'
        ) : (
          <div>
            <Typography color="primary" variant="subtitle2">
              {title}
            </Typography>
            <Typography color="textPrimary" sx={{ mt: 1 }} variant="subtitle1">
              <Typography color="textPrimary" variant="h5">
                <div>{_.round(last24h ?? 0, 2).toLocaleString('en-US')} kg</div>
              </Typography>
              <Typography color="textSecondary" variant="caption">
                <div />
                last 30 days
              </Typography>
              <Typography color="textSecondary" variant="h6">
                {_.round(last30d ?? 0, 2).toLocaleString('en-US')} kg
              </Typography>
            </Typography>
          </div>
        )}
      </Box>
    </Card>
  );
};
