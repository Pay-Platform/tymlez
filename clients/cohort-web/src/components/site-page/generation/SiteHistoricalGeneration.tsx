import type { FC } from 'react';
import { Chart } from '@tymlez/devias-material-kit/dist/components/chart';
import {
  Box,
  Card,
  CardHeader,
  Tooltip,
  Typography,
  Grid,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { useGenerationForecast } from '../api/useGenerationForecast';
import { chartOptionMapping } from './chartOptions';
import { TymlezLogo } from '../../TymlezLogo';

interface ISiteHistoricalGenerationProps {
  siteName?: string;
}

const SiteHistoricalGeneration: FC<ISiteHistoricalGenerationProps> = ({
  siteName,
}) => {
  const theme = useTheme();
  const chartOptions = chartOptionMapping(theme.palette);
  const handle = useFullScreenHandle();
  const {
    data: generation,
    isError,
    error,
  } = useGenerationForecast(siteName, 'daily', 'history');
  const chartType = 'line';

  if (isError) {
    return (
      <span>
        Error: {error instanceof Error ? error.message : 'Unknown error'}
      </span>
    );
  }

  return (
    <FullScreen handle={handle}>
      {handle.active && <TymlezLogo />}
      <Card elevation={12}>
        <CardHeader
          disableTypography
          title={
            <Box
              sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Grid container justifyContent="space-between" spacing={3}>
                <Grid item>
                  <Typography color="textPrimary" variant="h6">
                    GENERATION HISTORY
                  </Typography>
                </Grid>
                <Grid item>
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
                </Grid>
              </Grid>
            </Box>
          }
        />
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexWrap: 'wrap',
            px: 2,
          }}
        >
          {(generation || []).map((item) => (
            <Box
              key={item.name}
              sx={{
                alignItems: 'center',
                display: 'flex',
                mr: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: item.color,
                  borderRadius: '50%',
                  height: 8,
                  ml: 1,
                  mr: 2,
                  width: 8,
                }}
              />
              <Typography color="textPrimary" variant="subtitle2">
                {item.name}
              </Typography>
            </Box>
          ))}
        </Box>
        <Box p={3}>
          <Chart
            height={handle.active ? window.innerHeight - 200 : '393'}
            options={chartOptions.get(chartType)}
            series={generation || []}
            type={chartType}
          />
        </Box>
      </Card>
    </FullScreen>
  );
};

export default SiteHistoricalGeneration;
