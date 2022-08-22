'use strict';

/* eslint-disable camelcase */
import deepFreeze from 'deep-freeze-strict';
import Joi from 'joi';
import type {
  IBootstrap,
  IChannelDetail,
  ICircuitDetail,
  IClientDetail,
  IMeterDetail,
  ISiteDetail,
  ISolarDetail,
  IUserDetail,
} from './interfaces/IBootstrap';

export async function validateBootstrap({
  bootstrap,
  allowSecret,
}: {
  bootstrap: IBootstrap;
  allowSecret?: boolean;
}): Promise<void> {
  deepFreeze(bootstrap);

  const validatedBootstrap: IBootstrap = await getDeviceSchema(
    allowSecret,
  ).validateAsync(bootstrap, {
    abortEarly: false,
    allowUnknown: true,
  });

  deepFreeze(validatedBootstrap);

  validateChannelsForeignKeyToCircuit(validatedBootstrap);
  validateMeterNameAndKeyAreSame(validatedBootstrap);
  validateSolarNameAndKeyAreSame(validatedBootstrap);
  validateSiteNameAndKeyAreSame(validatedBootstrap);
  validateUserEmailAndKeyAreSame(validatedBootstrap);
}

const getDeviceSchema = (allowSecret: boolean | undefined) =>
  Joi.object<IBootstrap>({
    client_detail: Joi.object<IClientDetail>({
      name: Joi.string().required(),
      label: Joi.string().required(),
    }),
    site_details: Joi.object()
      .required()
      .pattern(
        Joi.string(),
        Joi.object<ISiteDetail>({
          name: Joi.string().required(),
          label: Joi.string().required(),
          address: Joi.string().required(),
          lat: Joi.number().required(),
          lng: Joi.number().required(),
          region: Joi.string()
            .required()
            .allow('QLD1', 'NSW1', 'TAS1', 'SA1', 'VIC1'),
          has_solar: Joi.boolean().required(),
          solcast_resource_id: Joi.string().allow(''),

          meter_details: Joi.object()
            .required()
            .pattern(
              Joi.string(),
              Joi.object<IMeterDetail & { api_key: string }>({
                name: Joi.string().required(),
                label: Joi.string().required(),
                meter_id: Joi.string().allow(''),
                lat: Joi.number().required(),
                lng: Joi.number().required(),
                description: Joi.string().required(),
                interval: Joi.number().required(),
                type: Joi.string().allow('ww', 'ee', 'nem'),
                isMain: Joi.bool(),
                circuit_details: Joi.array()
                  .required()
                  .max(6)
                  .items(
                    Joi.object<ICircuitDetail>({
                      name: Joi.string().required(),
                      label: Joi.string().required(),
                    }),
                  ),
                channel_details: Joi.array()
                  .required()
                  .max(6)
                  .items(
                    Joi.object<IChannelDetail>({
                      label: Joi.string().required(),
                      circuit_name: Joi.string().required(),
                    }),
                  ),
                api_key: allowSecret
                  ? Joi.string().required()
                  : Joi.forbidden(),
              }),
            ),

          solar_details: Joi.object().pattern(
            Joi.string(),
            Joi.object<ISolarDetail & { inverter_key: string }>({
              name: Joi.string().required(),
              label: Joi.string().allow(''),
              meter_id: Joi.string().allow(''),
              lat: Joi.number(),
              lng: Joi.number(),
              ac_capacity: Joi.number(),
              dc_capacity: Joi.number(),
              tracking: Joi.string().allow('fixed', 'horizontal', ''),
              inverter_url: Joi.string().allow(''),
              inverter_key: allowSecret
                ? Joi.string().required()
                : Joi.forbidden(),
            }),
          ),
        }),
      ),

    user_details: Joi.object()
      .required()
      .pattern(
        Joi.string(),
        Joi.object<IUserDetail & { password: string }>({
          email: Joi.string().email().required(),
          roles: Joi.array().required().items(Joi.string()),
          password: allowSecret ? Joi.string().required() : Joi.forbidden(),
        }),
      ),
    secrets_hash: Joi.string().required(),
  });

function validateChannelsForeignKeyToCircuit(validatedBootstrap: IBootstrap) {
  Object.values(validatedBootstrap.site_details).forEach((siteDetail) => {
    Object.values(siteDetail.meter_details).forEach((meterDetail) => {
      const circuitNames = meterDetail.circuit_details.map(
        (circuitDetail) => circuitDetail.name,
      );

      meterDetail.channel_details.forEach((channelDetail, index) => {
        if (!circuitNames.includes(channelDetail.circuit_name)) {
          throw new Error(
            `meterDetail.channel_details[${index}].circuit_name is: '${channelDetail.circuit_name}' not one of ${circuitNames}`,
          );
        }
      });
    });
  });
}

function validateMeterNameAndKeyAreSame(validatedBootstrap: IBootstrap) {
  Object.values(validatedBootstrap.site_details).forEach((siteDetail) => {
    Object.entries(siteDetail.meter_details).forEach(([key, meterDetail]) => {
      if (key !== meterDetail.name) {
        throw new Error(`meter[${key}].name is not the same as the key`);
      }
    });
  });
}

function validateSolarNameAndKeyAreSame(validatedBootstrap: IBootstrap) {
  Object.values(validatedBootstrap.site_details).forEach((siteDetail) => {
    Object.entries(siteDetail.solar_details ?? {}).forEach(
      ([key, solarDetail]) => {
        if (key !== solarDetail.name) {
          throw new Error(`solar[${key}].name is not the same as the key`);
        }
      },
    );
  });
}

function validateSiteNameAndKeyAreSame(validatedBootstrap: IBootstrap) {
  Object.entries(validatedBootstrap.site_details).forEach(
    ([key, siteDetail]) => {
      if (key !== siteDetail.name) {
        throw new Error(`site[${key}].name is not the same as the key`);
      }
    },
  );
}

function validateUserEmailAndKeyAreSame(validatedBootstrap: IBootstrap) {
  Object.entries(validatedBootstrap.user_details).forEach(
    ([key, userDetail]) => {
      if (key !== userDetail.email) {
        throw new Error(`user[${key}].email is not the same as the key`);
      }
    },
  );
}
