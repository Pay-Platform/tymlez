import { logger } from '@tymlez/backend-libs';

export function parsePubSubEventData(
  data: string | undefined,
): Object | undefined {
  try {
    const decodeData = data
      ? Buffer.from(data, 'base64').toString()
      : undefined;

    logger.info({ decodeData }, '--Data');

    if (decodeData) {
      return JSON.parse(decodeData) as Object;
    }
    logger.error({ data }, 'Data is empty');
  } catch (err) {
    logger.error({ err, data }, 'Failed to parse data');
  }

  return undefined;
}
