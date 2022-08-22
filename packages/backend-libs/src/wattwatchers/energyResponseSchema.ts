import Joi from 'joi';
import type { IWattwatchersLongEnergyResponseItem } from './IWattwatchersLongEnergyResponseItem';

export const energyResponseItemSchema =
  Joi.object<IWattwatchersLongEnergyResponseItem>({
    meter_id: Joi.string().required(),
    timestamp: Joi.number().required(),
    duration: Joi.number().required(),
    eReactiveKwh: Joi.array().required().items(Joi.number()),
    eRealKwh: Joi.array().required().items(Joi.number()),
  });

export const energyResponseSchema = Joi.array().items(energyResponseItemSchema);
