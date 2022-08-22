import type { FC } from 'react';

import {
  SiteRealTimeCircuitChart,
  SiteHistoricalCircuitChart,
} from './circuit';

interface SiteCircuitProps {
  siteName?: string;
}
export const SiteCircuit: FC<SiteCircuitProps> = ({ siteName }) => {
  return (
    <>
      <SiteRealTimeCircuitChart siteName={siteName} />
      <br />
      <SiteHistoricalCircuitChart siteName={siteName} />
    </>
  );
};
