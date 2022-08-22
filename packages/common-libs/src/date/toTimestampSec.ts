import type { ITimestampMsec } from './ITimestampMsec';
import type { ITimestampSec } from './ITimestampSec';

export function toTimestampSec(dateOrMs: Date | ITimestampMsec): ITimestampSec {
  if (dateOrMs instanceof Date) {
    return Math.round(dateOrMs.getTime() / 1000);
  }

  const ms = dateOrMs;
  return Math.round(ms / 1000);
}
