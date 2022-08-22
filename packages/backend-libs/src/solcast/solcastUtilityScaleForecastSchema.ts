import Joi from 'joi';
import type {
  ISolcastUtilityScaleForecastResponse,
  ISolcastUtilityScaleForecastItem,
} from './ISolcastUtilityScaleForecastResponse';

export const solcastUtilityScaleForecastResponseSchema =
  Joi.object<ISolcastUtilityScaleForecastResponse>({
    solcast_resource_id: Joi.string().required(),
    lat: [Joi.string(), Joi.number()],
    lon: [Joi.string(), Joi.number()],
    timezone: Joi.string(),
    timezone_offset: Joi.number(),
    forecasted_on: Joi.date().iso().required(),

    forecasts: Joi.array()
      .required()
      .items(
        Joi.object<ISolcastUtilityScaleForecastItem>({
          pv_estimate: Joi.number().required(),
          pv_estimate10: Joi.number().required(),
          pv_estimate90: Joi.number().required(),
          period_end: Joi.date().iso().required(),
          period: Joi.string()
            .required()
            .allow('PT5M', 'PT10M', 'PT15M', 'PT30M'),
        }),
      ),
  });
