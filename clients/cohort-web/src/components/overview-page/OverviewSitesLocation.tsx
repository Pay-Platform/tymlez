import type { FC } from 'react';
import { Box, Card, CardHeader, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { ICohortSiteDetail } from '@tymlez/cohort-api-interfaces';
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: '',
  shadowUrl: '',
  iconSize: [20, 32],
  iconAnchor: [10, 32],
});

L.Marker.prototype.options.icon = DefaultIcon;
interface Props {
  sites?: ICohortSiteDetail[];
}
export const OverviewSitesLocation: FC<Props> = ({ sites }) => {
  return (
    <Card elevation={12}>
      <CardHeader
        title={
          <Box
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography color="textPrimary" variant="h6">
              SITE LOCATIONS
            </Typography>
          </Box>
        }
      />
      <Box
        sx={{
          height: 336,
          minWidth: 100,
          px: 2,
        }}
      >
        <Box>
          <MapContainer
            center={[-27.735757, 153.099178]}
            zoom={9}
            scrollWheelZoom={false}
            style={{
              height: '35vh',
              width: '10wh',
              borderBottomLeftRadius: 16,
            }}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {sites?.map((site) => (
              <Marker key={site.name} position={[site.lat, site.lng]}>
                <Popup>{site.title}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </Box>
      </Box>
    </Card>
  );
};
