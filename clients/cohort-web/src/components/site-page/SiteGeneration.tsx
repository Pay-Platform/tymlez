import type { FC } from 'react';

import React from 'react';
import { SiteForecastGeneration, SiteHistoricalGeneration } from './generation';

interface ISiteGenerationProps {
  siteName?: string;
}

export const SiteGeneration: FC<ISiteGenerationProps> = ({ siteName }) => {
  return (
    <>
      <SiteForecastGeneration siteName={siteName} />
      <br />
      <SiteHistoricalGeneration siteName={siteName} />
    </>
  );
};
