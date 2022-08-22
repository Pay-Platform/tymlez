import type { ICohortMeterDetail } from '@tymlez/cohort-api-interfaces';
import type { FC } from 'react';

import {
  SiteRealtimeConsumptionChart,
  SiteHistoricalConsumptionChart,
} from './consumption';

interface SiteConsumptionProps {
  siteName?: string;
  meters: ICohortMeterDetail[];
}

export const SiteConsumption: FC<SiteConsumptionProps> = ({
  siteName,
  meters,
}) => {
  return (
    <>
      <SiteRealtimeConsumptionChart siteName={siteName} meters={meters} />
      <br />
      <SiteHistoricalConsumptionChart siteName={siteName} />
    </>
  );
};
