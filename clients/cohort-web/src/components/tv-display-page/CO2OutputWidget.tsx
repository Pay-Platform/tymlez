import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  CircularProgress,
} from '@mui/material';
import React, { ChangeEvent, FC, useCallback, useState } from 'react';
import _ from 'lodash';
import type { ICarbonEmissionsRecord } from '@tymlez/platform-api-interfaces';
import { StaticTimelineChart } from '../StaticTimelineChart';
import type { ChartSerie, ChartValue } from '../ChartSerie';
import { useSiteCarbonHistory } from '../../hooks/useSiteCarbonHistory';

interface Props {
  siteName?: string;
}

const initialSeries: ChartSerie[] = [
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
    ...initialSeries.map((s) => ({
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
      x: Number(record.timestamp),
      y: Number(record.produced),
    });
    result[1].data.push({
      x: Number(record.timestamp),
      y: -1 * Number(record.saved),
    });
    result[2].data.push({
      x: Number(record.timestamp),
      y: Number(record.produced - record.saved),
    });
  }
  return result.filter((item) => selectedSeries.includes(item.name));
};

export const CO2OutputWidget: FC<Props> = (props) => {
  const { siteName } = props;

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

  const { isLoading, data } = useSiteCarbonHistory(siteName);

  return (
    <Card
      elevation={12}
      sx={{
        mb: 3,
        height: '45vh',
        display: 'flex',
        alignItems: 'center',
        pb: 3,
      }}
    >
      <CardContent sx={{ width: '100%', height: '100%' }}>
        <Typography color="primary" variant="subtitle2" textAlign="left">
          CO2 OUTPUT
        </Typography>
        <Box sx={{ width: '100%', height: '100%' }}>
          <FormGroup row>
            <FormControlLabel
              key="CO2e Produced (Grid Consumption)"
              control={
                <Checkbox
                  checked
                  onChange={(event) =>
                    handleChangeSeriesOnOff(event, [initialSeries[0].name])
                  }
                  sx={{
                    color: initialSeries[0].color,
                    '&.Mui-checked': {
                      color: initialSeries[0].color,
                    },
                  }}
                />
              }
              label="CO2e Produced (Grid Consumption)"
            />
            <FormControlLabel
              key="CO2e Abated (Solar Generation)"
              control={
                <Checkbox
                  checked
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
              height="90%"
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
        </Box>
      </CardContent>
    </Card>
  );
};
