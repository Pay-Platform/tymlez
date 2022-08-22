import React, {
  useState,
  useMemo,
  useCallback,
  FC,
  useEffect,
  ChangeEvent,
} from 'react';
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
  Tooltip,
  Typography,
} from '@mui/material';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import { DynamicTimelineChart } from './DynamicTimelineChart';
import type { ChartType, Series } from './StaticTimelineChart';
import { TymlezLogo } from './TymlezLogo';

interface Props {
  series: Array<Series>;
  chartType?: ChartType;
  selectChartType?: boolean;
  width?: string | number;
  height?: string | number;
  xTitle?: string;
  yTitle?: string;
  enableDataLabels?: boolean;
  limit: number;
  title?: string;
}

export const DynamicTimeline: FC<Props> = ({
  series,
  chartType = 'line',
  selectChartType = false,
  width,
  height,
  xTitle,
  yTitle,
  enableDataLabels,
  limit,
  title,
}) => {
  const handle = useFullScreenHandle();

  const [selectedSeries, setSelectedSeries] = useState<Array<string>>([]);
  const seriesDescriptors = useMemo(
    () => series.map((item) => ({ name: item.name, color: item.color })),
    [series],
  );

  useEffect(() => {
    setSelectedSeries(seriesDescriptors.map((item) => item.name));
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

  const [selectedChartType, setChartType] = useState<ChartType>(chartType);
  const handleChangeChartType = useCallback(
    (event: React.ChangeEvent<{ value: unknown }>) => {
      setChartType(event.target.value as ChartType);
    },
    [],
  );

  const chartSeries = useMemo(
    () => series.filter((item) => selectedSeries.includes(item.name)),
    [series, selectedSeries],
  );

  return (
    <FullScreen handle={handle}>
      {handle.active && <TymlezLogo />}
      <Card elevation={12} sx={{ height: '90%' }}>
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
            height: '85%',
            width: '100%',
            padding: 5,
          }}
        >
          <Grid
            container
            justifyContent="space-between"
            alignItems="stretch"
            spacing={1}
          >
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
            <Grid item xs={12} md={12}>
              <DynamicTimelineChart
                series={chartSeries}
                type={selectedChartType}
                height={handle.active ? window.innerHeight - 300 : height}
                width={width}
                xTitle={xTitle}
                yTitle={yTitle}
                enableDataLabels={enableDataLabels}
                limit={limit}
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </FullScreen>
  );
};
