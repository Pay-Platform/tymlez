import { getProxy } from '@tymlez/backend-libs';
import type { ICohortSiteDetail } from '@tymlez/cohort-api-interfaces';

export async function getSites({
  platformApiHost,
  authorizationHeader,
}: {
  platformApiHost: string;
  authorizationHeader: string;
}) {
  return getProxy<ICohortSiteDetail[]>(
    `http://${platformApiHost}/api/sites/cohort`,
    authorizationHeader,
  );
}

export async function getSiteDetails({
  platformApiHost,
  authorizationHeader,
  siteName,
}: {
  correlationId: string;
  platformApiHost: string;
  authorizationHeader: string;
  siteName: string;
}) {
  return getProxy<ICohortSiteDetail>(
    `http://${platformApiHost}/api/sites/cohort/${siteName}`,
    authorizationHeader,
  );
}
