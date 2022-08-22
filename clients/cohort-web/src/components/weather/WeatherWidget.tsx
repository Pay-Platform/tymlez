import type { FC } from 'react';
import {
  Box,
  // Button,
  Card,
  // CardContent,
  // CardActions,
  // Divider,
  // Grid,
  Typography,
} from '@mui/material';
import { useWeather } from '../../api/useWeather';

interface Props {
  city?: string;
  country?: string;
  lat?: number;
  lon?: number;
  sx?: React.CSSProperties;
  color?: string;
}

export const WeatherWidget: FC<Props> = ({
  city,
  country,
  sx,
  color,
  lat,
  lon,
}) => {
  const { data, loading } = useWeather(city, country, lat, lon);
  return (
    <Card
      elevation={12}
      sx={{ height: '100%', display: 'flex', alignItems: 'center' }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-around',
          px: 3,
          py: 2,
          ...sx,
        }}
        color={color}
      >
        {loading ? (
          'Loading...'
        ) : data ? (
          <>
            <img
              style={{ width: 150 }}
              src={`http://openweathermap.org/img/wn/${data?.weather[0].icon}@2x.png`}
              alt="weather"
            />
            <div>
              <Typography color="primary" variant="subtitle2">
                {data?.name.toUpperCase()}
              </Typography>
              <Typography sx={{ mt: 1 }} variant="h4">
                {`${Math.round(data.main.temp)} °C`}
              </Typography>
              <Typography variant="body2" color="primary">
                {data?.weather[0].description}
              </Typography>
            </div>
          </>
        ) : (
          'unknown'
        )}
      </Box>
    </Card>
  );
};
