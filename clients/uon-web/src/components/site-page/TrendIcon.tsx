import type { FC } from 'react';
import React from 'react';
import { Box } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

interface Props {
  showTrend: boolean;
  percentageChange?: number;
}

export const TrendIcon: FC<Props> = ({ showTrend, percentageChange = 0 }) => {
  if (showTrend) {
    return (
      <Box
        component="span"
        sx={{
          mr: 1,
        }}
      >
        {percentageChange < 0 ? (
          <ArrowDownwardIcon
            sx={{
              color: '#f44336',
              fontSize: 'large',
            }}
          />
        ) : (
          <ArrowUpwardIcon
            sx={{
              color: '#4caf50',
              fontSize: 'large',
            }}
          />
        )}
      </Box>
    );
  }
  return <span />;
};
