import { DateRange, DateRangePicker, LocalizationProvider } from '@mui/lab';
import { Box, TextField } from '@mui/material';
import { FC, useCallback } from 'react';
import DateAdapter from '@mui/lab/AdapterDateFns';

export type HistoryQuery = {
  dateRange: DateRange<Date>;
};

interface Props {
  query: HistoryQuery;
  onUpdateQuery: (query: HistoryQuery) => void;
}

export const HistoryQueryForm: FC<Props> = (props) => {
  const { query, onUpdateQuery } = props;
  const setDateRange = useCallback(
    (dateRange) => {
      onUpdateQuery({ dateRange });
    },
    [onUpdateQuery],
  );

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <DateRangePicker
        disableCloseOnSelect={false}
        inputFormat="dd/MM/yyyy"
        startText="From"
        endText="To"
        value={query.dateRange}
        onChange={(newDateRange: any) => {
          if (newDateRange[0] && newDateRange[1]) {
            setDateRange(newDateRange);
          }
        }}
        renderInput={(startProps: any, endProps: any) => (
          <>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </>
        )}
      />
    </LocalizationProvider>
  );
};
