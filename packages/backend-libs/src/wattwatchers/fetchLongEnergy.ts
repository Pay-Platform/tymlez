/**
 * Refer to https://docs.wattwatchers.com.au/api/v3/endpoints.html#get-long-energydevice-id
 *
 * fromTs is inclusive
 * toTs is exclusive
 */
import { toTimestampSec } from '@tymlez/common-libs';
import axios from 'axios';
import { logger } from '../pino';
import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';
import { energyResponseSchema } from './energyResponseSchema';
import { WATTWATCHERS_API_URL } from './constants';

export async function fetchLongEnergy({
  deviceId,
  apiKey,
  fromDate,
  toDate,
}: {
  fromDate: Date;
  toDate?: Date;
  deviceId: string;
  apiKey: string;
}): Promise<IWattwatchersLongEnergyResponseItem[]> {
  const fromTs = toTimestampSec(fromDate);
  const toTs = toDate ? toTimestampSec(toDate) : undefined;

  const params = {
    'convert[energy]': 'kWh',
    fromTs,
    ...(toTs
      ? {
          toTs,
        }
      : undefined),
  };

  logger.info(
    {
      ...params,
      fromDate,
      toDate,
    },
    `Fetching long energy for ${deviceId}`,
  );

  const { data } = await axios.get(
    `${WATTWATCHERS_API_URL}/long-energy/${deviceId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      params,
    },
  );

  const dataWithMeterId = data.map((item: any) => ({
    ...item,
    meter_id: deviceId,
  }));

  await energyResponseSchema.validateAsync(dataWithMeterId, {
    abortEarly: false,
    allowUnknown: true,
  });

  return dataWithMeterId;
}
