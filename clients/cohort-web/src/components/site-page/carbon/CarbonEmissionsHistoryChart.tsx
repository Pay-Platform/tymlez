import { useState, useCallback, ChangeEvent } from 'react';
import type { FC } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Grid,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  Typography,
} from '@mui/material';
import type { ICarbonEmissionsRecord } from '@tymlez/platform-api-interfaces';
import _ from 'lodash';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { HistoryQueryForm } from '../../HistoryQueryForm';
import { TymlezLogo } from '../../TymlezLogo';
import { StaticTimelineChart } from '../../StaticTimelineChart';
import type { ChartSerie, ChartValue } from '../../ChartSerie';
import { useSiteCarbonHistory } from '../../../hooks/useSiteCarbonHistory';
import { formatMillisecondsWithTimeZone } from '../../../utils/date';

interface Props {
  siteName?: string;
}

const initalSeries: ChartSerie[] = [
  {
    name: 'CO2e Produced (Grid Consumption)',
    color: '#33cc33',
    data: [],
    type: 'column',
  },
  {
    name: 'CO2e Abated (Solar Generation)',
    color: '#00ff99',
    data: [],
    type: 'column',
  },
  {
    name: 'Net CO2e',
    color: '#006600',
    data: [],
    type: 'line',
  },
];

const fillData = (
  selectedSeries: string[],
  records?: ICarbonEmissionsRecord[],
): ChartSerie[] => {
  const result = [
    ...initalSeries.map((s) => ({
      ...s,
      data: [] as ChartValue[],
    })),
  ];
  if (!records) {
    return result;
  }
  const sortedRecords = _.chain(records).sortBy('timestamp').value();
  for (const record of sortedRecords) {
    result[0].data.push({
      x: Number(formatMillisecondsWithTimeZone(record.timestamp)),
      y: Number(record.produced),
    });
    result[1].data.push({
      x: Number(formatMillisecondsWithTimeZone(record.timestamp)),
      y: -1 * Number(record.saved),
    });
    result[2].data.push({
      x: Number(formatMillisecondsWithTimeZone(record.timestamp)),
      y: Number(record.produced - record.saved),
    });
  }
  return result.filter((item) => selectedSeries.includes(item.name));
};

export const CarbonEmissionsHistoryChart: FC<Props> = ({ siteName }) => {
  const handle = useFullScreenHandle();

  const {
    data,
    isLoading,
    query: historyQuery,
    setQuery: setHistoryQuery,
  } = useSiteCarbonHistory(siteName);

  const defaultSelectedSeries = initalSeries.map((i) => i.name);
  const [selectedSeries, setSelectedSeries] = useState<Array<string>>(
    defaultSelectedSeries,
  );
  const handleChangeSeriesOnOff = useCallback(
    (event: ChangeEvent<{ checked: boolean }>, names: string[]) => {
      setSelectedSeries((prevSelectedSeries) =>
        !event.target.checked
          ? prevSelectedSeries.filter((item) => !names.includes(item))
          : initalSeries
              .map((item) => item.name)
              .filter(
                (item: string) =>
                  names.includes(item) || prevSelectedSeries.includes(item),
              ),
      );
    },
    [],
  );
  const consumption = _.chain(data)
    .sumBy((r) => r.consumption)
    .value();
  const generation = _.chain(data)
    .sumBy((r) => r.generation)
    .value();
  const produced = _.chain(data)
    .sumBy((r) => r.produced)
    .value();
  const saved = _.chain(data)
    .sumBy((r) => r.saved)
    .value();

  return (
    <Card>
      <CardContent>
        <FullScreen handle={handle}>
          {handle.active && <TymlezLogo />}
          <Card>
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
                        HISTORICAL CARBON EMISSIONS
                      </Typography>
                    </Grid>
                    {historyQuery && setHistoryQuery && (
                      <Grid
                        item
                        container
                        xs={12}
                        sm={12}
                        md={6}
                        justifyContent={{ xs: 'flex-start', md: 'center' }}
                      >
                        <HistoryQueryForm
                          query={historyQuery}
                          onUpdateQuery={setHistoryQuery}
                        />
                      </Grid>
                    )}
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
                          <FullscreenIcon
                            fontSize="small"
                            onClick={handle.enter}
                          />
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
              <Grid container justifyContent="space-between" spacing={1}>
                <Grid item xs={12} sm={9}>
                  <FormGroup row>
                    <FormControlLabel
                      key={initalSeries[0].name}
                      control={
                        <Checkbox
                          checked={selectedSeries.some(
                            (visibleItem) =>
                              visibleItem === initalSeries[0].name,
                          )}
                          onChange={(event) =>
                            handleChangeSeriesOnOff(event, [
                              initalSeries[0].name,
                            ])
                          }
                          sx={{
                            color: initalSeries[0].color,
                            '&.Mui-checked': {
                              color: initalSeries[0].color,
                            },
                          }}
                        />
                      }
                      label={initalSeries[0].name}
                    />
                    <FormControlLabel
                      key="CO2e Abated (Solar Generation)"
                      control={
                        <Checkbox
                          checked={selectedSeries.some(
                            (visibleItem) =>
                              visibleItem === initalSeries[1].name,
                          )}
                          onChange={(event) =>
                            handleChangeSeriesOnOff(event, [
                              initalSeries[1].name,
                              initalSeries[2].name,
                            ])
                          }
                          sx={{
                            color: initalSeries[1].color,
                            '&.Mui-checked': {
                              color: initalSeries[1].color,
                            },
                          }}
                        />
                      }
                      label="CO2e Abated (Solar Generation)"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12}>
                  {isLoading ? (
                    <Box
                      sx={{
                        justifyContent: 'center',
                        display: 'flex',
                      }}
                    >
                      <CircularProgress sx={{ m: 2 }} />
                    </Box>
                  ) : (
                    <StaticTimelineChart
                      series={fillData(selectedSeries, data)}
                      type="bar"
                      height={handle.active ? window.innerHeight - 300 : 393}
                      yTitle="kg CO2e"
                      enableDataLabels={false}
                      tooltip={{
                        y: {
                          formatter: (val: string | number | Date) => {
                            return `${Number(val).toFixed(4)} kg CO2e`;
                          },
                        },
                      }}
                    />
                  )}
                </Grid>
              </Grid>
            </Box>
          </Card>
        </FullScreen>
        <Card elevation={12}>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Energy</TableCell>
                  <TableCell>Carbon (CO2e)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Consumption</TableCell>
                  <TableCell>{consumption.toFixed(2)} kWh</TableCell>
                  <TableCell>{produced.toFixed(2)} kg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Generation</TableCell>
                  <TableCell>{generation.toFixed(2)} kWh</TableCell>
                  <TableCell>{saved.toFixed(2)} kg</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Net</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {(produced - consumption).toFixed(2)} kWh
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>
                    {(produced - saved).toFixed(2)} kg
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};
