import { randomUUID } from 'crypto';
import type { IncomingMessage } from 'http';

export const genReqId = (request: IncomingMessage): string => {
  return request.headers['x-correlation-id']?.toString()
    ? request.headers['x-correlation-id'].toString()
    : randomUUID();
};
