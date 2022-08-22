import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { FC, useCallback } from 'react';
import type { VerificationPeriod } from '@tymlez/platform-api-interfaces';

export type VerificationQuery = {
  period: VerificationPeriod;
};

interface Props {
  query: VerificationQuery;
  onUpdateQuery: (query: VerificationQuery) => void;
}

export const VerificationQueryForm: FC<Props> = ({ query, onUpdateQuery }) => {
  const handleChange = useCallback(
    (period) => {
      onUpdateQuery({ period });
    },
    [onUpdateQuery],
  );

  return (
    <FormControl component="fieldset">
      {/*<FormLabel component="legend">Type</FormLabel>*/}
      <RadioGroup
        row
        aria-label="type"
        name="controlled-radio-buttons-group"
        value={query.period}
        onChange={(e) => handleChange(e.target.value)}
      >
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="24h" control={<Radio />} label="Last 24h" />
      </RadioGroup>
    </FormControl>
  );
};
