import axios from 'axios';
import { useQuery } from 'react-query';
import _ from 'lodash';
import type {
  ICarbonEmissionsRecord,
  ITimestampMsec,
} from '@tymlez/platform-api-interfaces';

const processRecords = (
  emissionsRecords: ICarbonEmissionsRecord[],
): ICarbonEmissionsRecord[] => {
  return _.chain(emissionsRecords).sortBy('settlementDate').value();
};

async function fetchSiteCircuitRealtime(
  since: ITimestampMsec,
  siteName?: string,
): Promise<ICarbonEmissionsRecord[] | undefined> {
  if (siteName) {
    const params = { since, siteName };
    const { data }: { data: ICarbonEmissionsRecord[] } = await axios.get<
      ICarbonEmissionsRecord[]
    >(`${process.env.NEXT_PUBLIC_COHORT_API_URL}/dashboard/carbon/realtime`, {
      params,
    });
    const records = processRecords(data);
    return records;
  }
  return undefined;
}

export const useCarbonEmissionsRealtime = (
  since: number,
  siteName?: string,
) => {
  return useQuery<ICarbonEmissionsRecord[] | undefined>(
    ['carbon-emissions-realtime'],
    () => fetchSiteCircuitRealtime(since, siteName),
    {
      // Refetch the data every second
      refetchInterval: 300000,
      // Currently used to handle the bug of only one data point beiing displayed when siwtching between other widgets .e.g consumption->generation->consumption
      cacheTime: 0,
    },
  );
};
