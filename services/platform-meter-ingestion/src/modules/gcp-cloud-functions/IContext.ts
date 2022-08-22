import type { IIsoDate } from '@tymlez/platform-api-interfaces';

export type IContext = {
  timestamp?: IIsoDate;
  eventId?: string;
  eventType?: string;
  resource?: string;
};
