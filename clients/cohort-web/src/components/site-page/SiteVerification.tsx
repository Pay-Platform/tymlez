import type { FC } from 'react';

import { VerificationTable } from './verification';

interface Props {
  siteName?: string;
}
export const SiteVerification: FC<Props> = ({ siteName }) => {
  return <VerificationTable siteName={siteName} />;
};
