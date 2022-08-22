import type { FC } from 'react';

import {
  CarbonEmissionsRealTimeChart,
  CarbonEmissionsHistoryChart,
} from './carbon';

interface SiteCarbonProps {
  siteName?: string;
}
export const SiteCarbon: FC<SiteCarbonProps> = ({ siteName }) => {
  return (
    <>
      <CarbonEmissionsRealTimeChart siteName={siteName} />
      <br />
      <CarbonEmissionsHistoryChart siteName={siteName} />
    </>
  );
};
