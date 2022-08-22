import type { FC } from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import type { ILatitude, ILongitude } from '@tymlez/platform-api-interfaces';

const DefaultIcon = L.icon({
  iconUrl: icon.src,
  shadowUrl: iconShadow.src,
  iconSize: [20, 32],
  iconAnchor: [10, 32],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface IOverviewLocationProps {
  location:
    | {
        lat: ILatitude;
        lng: ILongitude;
        address: string;
        title: string;
      }
    | undefined;
  variant?: 'elevation' | 'outlined';
}

export const OverviewLocation: FC<IOverviewLocationProps> = ({
  location,
  variant,
}) => {
  return (
    <Card variant={variant}>
      <Box
        sx={{
          height: '100%',
          width: '100%',
          px: 2,
        }}
      >
        <CardContent>
          <Box>
            {window && location && location.lat && location.lng ? (
              <MapContainer
                center={[location.lat, location.lng]}
                zoom={15}
                scrollWheelZoom={false}
                style={{
                  height: '35vh',
                  width: '10wh',
                }}
              >
                <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[location.lat, location.lng]}>
                  <Popup>
                    {location?.title}:{location?.address}
                  </Popup>
                </Marker>
              </MapContainer>
            ) : null}
          </Box>
          <Typography color="primary" variant="subtitle2">
            {location?.address}
          </Typography>
        </CardContent>
      </Box>
    </Card>
  );
};

export default OverviewLocation;
