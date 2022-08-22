'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBootstrap = void 0;
/* eslint-disable camelcase */
const deep_freeze_strict_1 = __importDefault(require("deep-freeze-strict"));
const joi_1 = __importDefault(require("joi"));
async function validateBootstrap({ bootstrap, allowSecret, }) {
    (0, deep_freeze_strict_1.default)(bootstrap);
    const validatedBootstrap = await getDeviceSchema(allowSecret).validateAsync(bootstrap, {
        abortEarly: false,
        allowUnknown: true,
    });
    (0, deep_freeze_strict_1.default)(validatedBootstrap);
    validateChannelsForeignKeyToCircuit(validatedBootstrap);
    validateMeterNameAndKeyAreSame(validatedBootstrap);
    validateSolarNameAndKeyAreSame(validatedBootstrap);
    validateSiteNameAndKeyAreSame(validatedBootstrap);
    validateUserEmailAndKeyAreSame(validatedBootstrap);
}
exports.validateBootstrap = validateBootstrap;
const getDeviceSchema = (allowSecret) => joi_1.default.object({
    client_detail: joi_1.default.object({
        name: joi_1.default.string().required(),
        label: joi_1.default.string().required(),
    }),
    site_details: joi_1.default.object()
        .required()
        .pattern(joi_1.default.string(), joi_1.default.object({
        name: joi_1.default.string().required(),
        label: joi_1.default.string().required(),
        address: joi_1.default.string().required(),
        lat: joi_1.default.number().required(),
        lng: joi_1.default.number().required(),
        region: joi_1.default.string()
            .required()
            .allow('QLD1', 'NSW1', 'TAS1', 'SA1', 'VIC1'),
        has_solar: joi_1.default.boolean().required(),
        solcast_resource_id: joi_1.default.string().allow(''),
        meter_details: joi_1.default.object()
            .required()
            .pattern(joi_1.default.string(), joi_1.default.object({
            name: joi_1.default.string().required(),
            label: joi_1.default.string().required(),
            meter_id: joi_1.default.string().allow(''),
            lat: joi_1.default.number().required(),
            lng: joi_1.default.number().required(),
            description: joi_1.default.string().required(),
            interval: joi_1.default.number().required(),
            type: joi_1.default.string().allow('ww', 'ee', 'nem'),
            isMain: joi_1.default.bool(),
            circuit_details: joi_1.default.array()
                .required()
                .max(6)
                .items(joi_1.default.object({
                name: joi_1.default.string().required(),
                label: joi_1.default.string().required(),
            })),
            channel_details: joi_1.default.array()
                .required()
                .max(6)
                .items(joi_1.default.object({
                label: joi_1.default.string().required(),
                circuit_name: joi_1.default.string().required(),
            })),
            api_key: allowSecret
                ? joi_1.default.string().required()
                : joi_1.default.forbidden(),
        })),
        solar_details: joi_1.default.object().pattern(joi_1.default.string(), joi_1.default.object({
            name: joi_1.default.string().required(),
            label: joi_1.default.string().allow(''),
            meter_id: joi_1.default.string().allow(''),
            lat: joi_1.default.number(),
            lng: joi_1.default.number(),
            ac_capacity: joi_1.default.number(),
            dc_capacity: joi_1.default.number(),
            tracking: joi_1.default.string().allow('fixed', 'horizontal', ''),
            inverter_url: joi_1.default.string().allow(''),
            inverter_key: allowSecret
                ? joi_1.default.string().required()
                : joi_1.default.forbidden(),
        })),
    })),
    user_details: joi_1.default.object()
        .required()
        .pattern(joi_1.default.string(), joi_1.default.object({
        email: joi_1.default.string().email().required(),
        roles: joi_1.default.array().required().items(joi_1.default.string()),
        password: allowSecret ? joi_1.default.string().required() : joi_1.default.forbidden(),
    })),
    secrets_hash: joi_1.default.string().required(),
});
function validateChannelsForeignKeyToCircuit(validatedBootstrap) {
    Object.values(validatedBootstrap.site_details).forEach((siteDetail) => {
        Object.values(siteDetail.meter_details).forEach((meterDetail) => {
            const circuitNames = meterDetail.circuit_details.map((circuitDetail) => circuitDetail.name);
            meterDetail.channel_details.forEach((channelDetail, index) => {
                if (!circuitNames.includes(channelDetail.circuit_name)) {
                    throw new Error(`meterDetail.channel_details[${index}].circuit_name is: '${channelDetail.circuit_name}' not one of ${circuitNames}`);
                }
            });
        });
    });
}
function validateMeterNameAndKeyAreSame(validatedBootstrap) {
    Object.values(validatedBootstrap.site_details).forEach((siteDetail) => {
        Object.entries(siteDetail.meter_details).forEach(([key, meterDetail]) => {
            if (key !== meterDetail.name) {
                throw new Error(`meter[${key}].name is not the same as the key`);
            }
        });
    });
}
function validateSolarNameAndKeyAreSame(validatedBootstrap) {
    Object.values(validatedBootstrap.site_details).forEach((siteDetail) => {
        Object.entries(siteDetail.solar_details ?? {}).forEach(([key, solarDetail]) => {
            if (key !== solarDetail.name) {
                throw new Error(`solar[${key}].name is not the same as the key`);
            }
        });
    });
}
function validateSiteNameAndKeyAreSame(validatedBootstrap) {
    Object.entries(validatedBootstrap.site_details).forEach(([key, siteDetail]) => {
        if (key !== siteDetail.name) {
            throw new Error(`site[${key}].name is not the same as the key`);
        }
    });
}
function validateUserEmailAndKeyAreSame(validatedBootstrap) {
    Object.entries(validatedBootstrap.user_details).forEach(([key, userDetail]) => {
        if (key !== userDetail.email) {
            throw new Error(`user[${key}].email is not the same as the key`);
        }
    });
}
//# sourceMappingURL=validateBootstrap.js.map