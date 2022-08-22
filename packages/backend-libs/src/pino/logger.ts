import pino from 'pino';
import { loggerConfigs } from './config';

export const logger = pino({
  level: loggerConfigs.LOG_LEVEL,
  errorLikeObjectKeys: ['err', 'error'],
  transport:
    loggerConfigs.NODE_ENV !== 'production'
      ? {
          target: 'pino-pretty',
          options: {
            colorize: true,
          },
        }
      : undefined,
});
