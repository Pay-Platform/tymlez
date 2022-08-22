import Joi from 'joi';
import type { ICarbonEmission } from './ICarbonEmission';

export const carbonEmissionSchema = Joi.object<ICarbonEmission>({
  regionid: Joi.string().required(),
  settlement_date: Joi.date().iso().required(),
  energy: Joi.number(),
  emission: Joi.number(),
  factor: Joi.number(),
});
