import type { IIsoDate } from '@tymlez/platform-api-interfaces';
import { first, last } from 'lodash';
import { findMissingTimestamps } from '../../utils/datetime';
import { getSettlementDatesLast30Days } from './getSettlementDatesLast30Days';

export async function getMissingSettlementTimestampsInDb(): Promise<
  IIsoDate[]
> {
  const pastSettlementDates = await getSettlementDatesLast30Days();

  const startDate = first(pastSettlementDates);
  const endDate = last(pastSettlementDates);

  if (startDate && endDate && startDate !== endDate) {
    return findMissingTimestamps(pastSettlementDates, startDate, endDate, 300);
  }

  return [];
}
