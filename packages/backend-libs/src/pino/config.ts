import joi from 'joi';
import { getEnvConfig } from '../env';

export interface ILoggerConfig {
  LOG_LEVEL: string;
  NODE_ENV: string;
}

export const loggerConfigs = getEnvConfig<ILoggerConfig>({
  LOG_LEVEL: joi
    .string()
    .valid('debug', 'info', 'error')
    .optional()
    .default('info'),
  NODE_ENV: joi
    .string()
    .valid('production', 'development', 'local', 'test')
    .optional()
    .default('local'),
});
