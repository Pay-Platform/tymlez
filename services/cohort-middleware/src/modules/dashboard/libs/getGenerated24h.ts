import type { kWh } from '@tymlez/platform-api-interfaces';
import { getProxy } from '@tymlez/backend-libs';

export async function getGenerated24h({
  platformApiHost,
  authorizationHeader,
}: {
  platformApiHost: string;
  authorizationHeader: string;
}) {
  return getProxy<kWh>(
    `http://${platformApiHost}/api/sites/generated24h`,
    authorizationHeader,
  );
}
