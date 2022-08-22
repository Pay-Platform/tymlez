import { getProxy } from '@tymlez/backend-libs';
import type {
  ICarbonEmissionsRecord,
  ITimestampMsec,
  ISiteEmissionTotal,
} from '@tymlez/platform-api-interfaces';

export async function getCarbonEmissionsRealtime({
  platformApiHost,
  correlationId,
  authorizationHeader,
  siteName,
  meterId,
  regionId,
  columns,
  since,
}: {
  platformApiHost: string;
  correlationId: string;
  authorizationHeader: string;
  siteName: string;
  meterId: string;
  regionId: string;
  columns: string;
  since?: ITimestampMsec;
}): Promise<ICarbonEmissionsRecord[]> {
  return getProxy<ICarbonEmissionsRecord[]>(
    `http://${platformApiHost}/api/carbon/realtime/${siteName}`,
    authorizationHeader,
    correlationId,
    {
      meterId,
      regionId,
      columns,
      since,
    },
  );
}

export async function getCarbonEmissionsHistory({
  platformApiHost,
  correlationId,
  authorizationHeader,
  siteName,
  meterId,
  regionId,
  columns,
  from,
  to,
}: {
  platformApiHost: string;
  correlationId: string;
  authorizationHeader: string;
  siteName: string;
  meterId: string;
  regionId: string;
  columns: string;
  from: ITimestampMsec;
  to: ITimestampMsec;
}): Promise<ICarbonEmissionsRecord[]> {
  return getProxy<ICarbonEmissionsRecord[]>(
    `http://${platformApiHost}/api/carbon/history/${siteName}`,
    authorizationHeader,
    correlationId,
    {
      meterId,
      regionId,
      columns,
      from,
      to,
    },
  );
}

export async function getCarbonEmissionsTotal({
  platformApiHost,
  correlationId,
  authorizationHeader,
  siteName,
  meterId,
  regionId,
  columns,
}: {
  platformApiHost: string;
  correlationId: string;
  authorizationHeader: string;
  siteName: string;
  meterId: string;
  regionId: string;
  columns: string;
}): Promise<ISiteEmissionTotal> {
  return getProxy<ISiteEmissionTotal>(
    `http://${platformApiHost}/api/carbon/total/${siteName}`,
    authorizationHeader,
    correlationId,
    {
      meterId,
      regionId,
      columns,
    },
  );
}
