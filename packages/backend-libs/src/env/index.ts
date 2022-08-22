/* eslint-disable no-process-env */

import joi, { PartialSchemaMap } from 'joi';

export function getEnvConfig<T>(config: PartialSchemaMap<T>) {
  const envVarsSchema = joi.object<T>().keys(config).unknown();

  const { value: envVars, error } = envVarsSchema
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

  if (error) {
    throw new Error(`Config validation error: ${error.message}`);
  }
  return envVars as T;
}
