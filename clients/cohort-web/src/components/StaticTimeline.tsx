/**
 * Widget to show static timeline chart with one or more series.
 * User can turn on/off specific series.
 * User can switch mode: Line or Area.
 */
import {
  Box,
  Card,
  CardHeader,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Tooltip,
  CircularProgress,
} from '@mui/material';
import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { HistoryQuery, HistoryQueryForm } from './HistoryQueryForm';
import { ChartType, Series, StaticTimelineChart } from './StaticTimelineChart';
import { TymlezLogo } from './TymlezLogo';

interface Props {
  isLoading?: boolean;
  series: Array<Series>;
  chartType?: ChartType;
  selectChartType?: boolean;
  width?: string | number;
  height?: string | number;
  xTitle?: string;
  yTitle?: string;
  enableDataLabels?: boolean;
  title?: string;
  historyQuery?: HistoryQuery;
  setHistoryQuery?: Dispatch<SetStateAction<HistoryQuery>>;
  footer?: React.ReactElement;
}

export const StaticTimeline: FC<Props> = ({
  isLoading,
  series,
  chartType = 'line',
  selectChartType = false,
  width,
  height,
  xTitle,
  yTitle,
  enableDataLabels,
  title,
  historyQuery,
  setHistoryQuery,
  footer,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<Array<string>>([]);
  const seriesDescriptors = useMemo(
    () => series.map((item) => ({ name: item.name, color: item.color })),
    [series],
  );
  const handle = useFullScreenHandle();
  useEffect(() => {
    setSelectedSeries(seriesDescriptors.map((item) => item.name).filter((item)=>(selectedSeries.length==0?!selectedSeries.includes(item):selectedSeries.includes(item))));
  

  }, [seriesDescriptors]);

  const handleChangeSeriesOnOff = useCallback(
    (event: ChangeEvent<{ checked: boolean }>, name: string) => {
      setSelectedSeries((prevSelectedSeries) =>
        !event.target.checked
          ? prevSelectedSeries.filter((item) => item !== name)
          : seriesDescriptors
              .map((item) => item.name)
              .filter(
                (item: string) =>
                  item === name || prevSelectedSeries.includes(item),
              ),
      );
    },
    [seriesDescriptors],
  );

  const chartSeries = useMemo(
    () => series.filter((item) => selectedSeries.includes(item.name)),
    [series, selectedSeries],
  );

  const [selectedChartType, setChartType] = useState<ChartType>(chartType);
  const handleChangeChartType = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setChartType(event.target.value as ChartType);
    },
    [],
  );

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
                    {title}
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
                {seriesDescriptors.map((item) => (
                  <FormControlLabel
                    key={item.name}
                    control={
                      <Checkbox
                        checked={selectedSeries.some(
                          (visibleItem) => visibleItem === item.name,
                        )}
                        onChange={(event) =>
                          handleChangeSeriesOnOff(event, item.name)
                        }
                        sx={{
                          color: item.color,
                          '&.Mui-checked': {
                            color: item.color,
                          },
                        }}
                      />
                    }
                    label={item.name}
                  />
                ))}
              </FormGroup>
            </Grid>
            {selectChartType && (
              <Grid item xs={12} sm={3} container justifyContent="flex-end">
                <FormControl>
                  <RadioGroup
                    row
                    aria-label="chart type"
                    name="chartType"
                    value={selectedChartType}
                    onChange={handleChangeChartType}
                    defaultValue="line"
                  >
                    <FormControlLabel
                      value="line"
                      control={<Radio color="primary" />}
                      label="Line"
                      labelPlacement="end"
                    />
                    <FormControlLabel
                      value="area"
                      control={<Radio color="primary" />}
                      label="Area"
                      labelPlacement="end"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            )}
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
                  series={chartSeries}
                  type={selectedChartType}
                  height={handle.active ? window.innerHeight - 300 : height}
                  width={width}
                  xTitle={xTitle}
                  yTitle={yTitle}
                  enableDataLabels={enableDataLabels}
                />
              )}
            </Grid>
          </Grid>
        </Box>
        {footer}
      </Card>
    </FullScreen>
  );
};
