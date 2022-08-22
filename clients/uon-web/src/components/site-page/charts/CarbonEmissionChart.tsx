import { useState, useCallback, ChangeEvent } from 'react';
import type { FC } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Grid,
  Tooltip,
  Typography,
} from '@mui/material';
import _ from 'lodash';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { HistoryQueryForm } from '../../HistoryQueryForm';
import { TymlezLogo } from '../../TymlezLogo';
import { StaticTimelineChart } from '../../StaticTimelineChart';
import type {
  IPoint,
  ChartSeries,
  ICarbonData,
} from '../../../api/dashboard/TEMPORARY';
import { formatMillisecondsWithTimeZone } from '../../../utils/date';
import { useCarbonEmission } from '../../../api/dashboard';

interface Props {
  siteName?: string;
}

const initialSeries: ChartSeries[] = [
  {
    name: 'Carbon Produced',
    color: '#33cc33',
    data: [],
    type: 'column',
  },
  {
    name: 'Carbon Abated',
    color: '#00ff99',
    data: [],
    type: 'column',
  },
  {
    name: 'Net Carbon',
    color: '#006600',
    data: [],
    type: 'line',
  },
];

const fillData = (
  selectedSeries: string[],
  records?: ICarbonData[],
): ChartSeries[] => {
  const result = [
    ...initialSeries.map((s) => ({
      ...s,
      data: [] as IPoint[],
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
      y: -1 * Number(record.abated),
    });
    result[2].data.push({
      x: Number(formatMillisecondsWithTimeZone(record.timestamp)),
      y: Number(record.produced - record.abated),
    });
  }
  return result.filter((item) => selectedSeries.includes(item.name));
};

export const CarbonEmissionChart: FC<Props> = () => {
  const handle = useFullScreenHandle();
  const startDate = new Date('2022-03-30');
  const endTime = new Date('2022-04-02');
  const {
    data,
    isLoading,
    query: historyQuery,
    setQuery: setHistoryQuery,
  } = useCarbonEmission(startDate, endTime);

  const defaultSelectedSeries = initialSeries.map((i) => i.name);
  const [selectedSeries, setSelectedSeries] = useState<Array<string>>(
    defaultSelectedSeries,
  );
  const handleChangeSeriesOnOff = useCallback(
    (event: ChangeEvent<{ checked: boolean }>, names: string[]) => {
      setSelectedSeries((prevSelectedSeries) =>
        !event.target.checked
          ? prevSelectedSeries.filter((item) => !names.includes(item))
          : initialSeries
              .map((item) => item.name)
              .filter(
                (item: string) =>
                  names.includes(item) || prevSelectedSeries.includes(item),
              ),
      );
    },
    [],
  );

  return (
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
                    CARBON EMISSIONS
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
          <Grid container justifyContent="space-between" spacing={1}>
            <Grid item xs={12} sm={9}>
              <FormGroup row>
                <FormControlLabel
                  key={initialSeries[0].name}
                  control={
                    <Checkbox
                      checked={selectedSeries.some(
                        (visibleItem) => visibleItem === initialSeries[0].name,
                      )}
                      onChange={(event) =>
                        handleChangeSeriesOnOff(event, [
                          initialSeries[0].name,
                          initialSeries[2].name,
                        ])
                      }
                      sx={{
                        color: initialSeries[0].color,
                        '&.Mui-checked': {
                          color: initialSeries[0].color,
                        },
                      }}
                    />
                  }
                  label={initialSeries[0].name}
                />
                <FormControlLabel
                  key="CO2e Abated (Solar Generation)"
                  control={
                    <Checkbox
                      checked={selectedSeries.some(
                        (visibleItem) => visibleItem === initialSeries[1].name,
                      )}
                      onChange={(event) =>
                        handleChangeSeriesOnOff(event, [
                          initialSeries[1].name,
                          initialSeries[2].name,
                        ])
                      }
                      sx={{
                        color: initialSeries[1].color,
                        '&.Mui-checked': {
                          color: initialSeries[1].color,
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
                  series={fillData(selectedSeries, data?.data)}
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
  );
};
