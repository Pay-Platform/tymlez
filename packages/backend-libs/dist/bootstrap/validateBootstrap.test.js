"use strict";
/* eslint-disable no-param-reassign */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const immer_1 = __importDefault(require("immer"));
const assert_1 = __importDefault(require("assert"));
const validateBootstrap_1 = require("./validateBootstrap");
describe('validateBootstrap', () => {
    it('should return validated bootstrap for valid input', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await (0, validateBootstrap_1.validateBootstrap)({
            bootstrap: mockedBootstrap,
        });
    });
    it('should return validated bootstrap for valid input with secret when allowed', async () => {
        const mockedBootstrap = getMockedBootstrap({ addSecret: true });
        await (0, validateBootstrap_1.validateBootstrap)({
            bootstrap: mockedBootstrap,
            allowSecret: true,
        });
    });
    it('should return validated bootstrap even if solar_details is missing', async () => {
        const mockedBootstrap = getMockedBootstrap();
        const bootstrapWithoutSolarDetail = (0, immer_1.default)(mockedBootstrap, (draft) => {
            draft.site_details.main.solar_details = undefined;
        });
        await (0, validateBootstrap_1.validateBootstrap)({
            bootstrap: bootstrapWithoutSolarDetail,
        });
    });
    it('should throw correct error if client_details.name is missing', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: {
                ...mockedBootstrap,
                client_detail: {
                    ...mockedBootstrap.client_detail,
                    //@ts-expect-error force error in test
                    name: undefined,
                },
            },
        })).rejects.toThrowError(/"client_detail.name.+ is required/);
    });
    it('should throw correct error if meter_details is missing', async () => {
        const mockedBootstrap = getMockedBootstrap();
        const bootstrapWithoutMeterDetail = (0, immer_1.default)(mockedBootstrap, (draft) => {
            //@ts-expect-error force error in test
            draft.site_details.main.meter_details = undefined;
        });
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: bootstrapWithoutMeterDetail,
        })).rejects.toThrowError(/meter_details.+ is required/);
    });
    it('should throw correct error if meter has more than 6 channels', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                draft.site_details.main.meter_details['meter-2'].channel_details.push({
                    label: 'T1 Phase 4',
                    circuit_name: 't1',
                });
            }),
        })).rejects.toThrowError(/channel_details.+ must contain less than or equal to 6 items/);
    });
    it('should throw correct error if channel > circuit_name not one of the circuits in the meter', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                draft.site_details.main.meter_details['meter-2'].channel_details[0].circuit_name = 'invalid circuit';
            }),
        })).rejects.toThrowError(/circuit_name is: .+ not one of/);
    });
    it('should throw correct error if site.name not equal to its record key', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                draft.site_details.main.name = 'wrong site name';
            }),
        })).rejects.toThrowError(/site.+name is not the same as the key/);
    });
    it('should throw correct error if user.email not equal to its record key', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                draft.user_details['admin@cohort.com'].email = 'guest@cohort.com';
            }),
        })).rejects.toThrowError(/user.+email is not the same as the key/);
    });
    it('should throw correct error if meter.name not equal to its record key', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                draft.site_details.main.meter_details['meter-2'].name =
                    'wrong meter name';
            }),
        })).rejects.toThrowError(/meter.+name is not the same as the key/);
    });
    it('should throw correct error if solar.name not equal to its record key', async () => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                (0, assert_1.default)(draft.site_details.main.solar_details);
                draft.site_details.main.solar_details['solar-1'].name =
                    'wrong solar name';
            }),
        })).rejects.toThrowError(/solar.+name is not the same as the key/);
    });
    it.each([null, '', 'api key 1'])('should throw correct error if api_key is "%s" (non-empty)', async (apiKey) => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                //@ts-expect-error force error in test
                draft.site_details.main.meter_details['meter-2'].api_key = apiKey;
            }),
        })).rejects.toThrowError(/api_key.+ is not allowed/);
    });
    it.each([null, '', 'password 1'])('should throw correct error if password is "%s" (non-empty)', async (password) => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                //@ts-expect-error force error in test
                draft.user_details['admin@cohort.com'].password = password;
            }),
        })).rejects.toThrowError(/password.+ is not allowed/);
    });
    it.each([undefined, null, ''])('should throw correct error if password is "%s" (empty)', async (password) => {
        const mockedBootstrap = getMockedBootstrap();
        await expect((0, validateBootstrap_1.validateBootstrap)({
            bootstrap: (0, immer_1.default)(mockedBootstrap, (draft) => {
                //@ts-expect-error force error in test
                draft.user_details['admin@cohort.com'].password = password;
            }),
            allowSecret: true,
        })).rejects.toThrowError(/password.+ is required/);
    });
});
function getMockedBootstrap({ addSecret, } = {}) {
    return {
        client_detail: {
            name: 'cohort',
            label: 'Cohort',
        },
        site_details: {
            main: {
                name: 'main',
                label: 'Main Site',
                address: '16 Nexus Way, Southport QLD 4215',
                lat: -27.9624495,
                lng: 153.3817313,
                has_solar: true,
                solcast_resource_id: '',
                region: 'QLD1',
                timezone_offset: 60,
                meter_details: {
                    'meter-1': {
                        name: 'meter-1',
                        meter_id: '',
                        isMain: true,
                        label: '1. Main',
                        description: 'Main income supply (1x A3RM)',
                        lat: -27.9624495,
                        lng: 153.3817313,
                        type: 'wattwatcher',
                        interval: 300,
                        status: 'offline',
                        active_from: '',
                        circuit_details: [
                            {
                                name: 'main',
                                label: 'Main Circuit',
                            },
                        ],
                        channel_details: [
                            {
                                label: 'Main Phase 1',
                                circuit_name: 'main',
                            },
                            {
                                label: 'Main Phase 2',
                                circuit_name: 'main',
                            },
                            {
                                label: 'Main Phase 3',
                                circuit_name: 'main',
                            },
                        ],
                        ...(addSecret ? { api_key: 'api key 1' } : {}),
                    },
                    'meter-2': {
                        name: 'meter-2',
                        meter_id: '',
                        label: '2. TER and T1',
                        description: 'Main income supply (1x A3RM)',
                        lat: -27.9624495,
                        lng: 153.3817313,
                        type: 'wattwatcher',
                        interval: 300,
                        status: 'offline',
                        active_from: '',
                        circuit_details: [
                            {
                                name: 'ter',
                                label: 'TER Circuit',
                            },
                            {
                                name: 't1',
                                label: 'T1 Circuit',
                            },
                        ],
                        channel_details: [
                            {
                                label: 'TER Phase 1',
                                circuit_name: 'ter',
                            },
                            {
                                label: 'TER Phase 2',
                                circuit_name: 'ter',
                            },
                            {
                                label: 'TER Phase 3',
                                circuit_name: 'ter',
                            },
                            {
                                label: 'T1 Phase 1',
                                circuit_name: 't1',
                            },
                            {
                                label: 'T1 Phase 2',
                                circuit_name: 't1',
                            },
                            {
                                label: 'T1 Phase 3',
                                circuit_name: 't1',
                            },
                        ],
                        ...(addSecret ? { api_key: 'api key 2' } : {}),
                    },
                    'meter-3': {
                        name: 'meter-3',
                        meter_id: '',
                        label: '3. T3 and T4',
                        description: '1x A6M 6x 120 A CT',
                        lat: -27.9624495,
                        lng: 153.3817313,
                        type: 'wattwatcher',
                        interval: 300,
                        status: 'online',
                        active_from: '',
                        circuit_details: [
                            {
                                name: 't3',
                                label: 'T3 Circuit',
                            },
                            {
                                name: 't4',
                                label: 'T4 Circuit',
                            },
                        ],
                        channel_details: [
                            {
                                label: 'T3 Phase 1',
                                circuit_name: 't3',
                            },
                            {
                                label: 'T3 Phase 2',
                                circuit_name: 't3',
                            },
                            {
                                label: 'T3 Phase 3',
                                circuit_name: 't3',
                            },
                            {
                                label: 'T4 Phase 1',
                                circuit_name: 't4',
                            },
                            {
                                label: 'T4 Phase 2',
                                circuit_name: 't4',
                            },
                            {
                                label: 'T4 Phase 3',
                                circuit_name: 't4',
                            },
                        ],
                        ...(addSecret ? { api_key: 'api key 3' } : {}),
                    },
                    'meter-4': {
                        name: 'meter-4',
                        meter_id: '',
                        label: '4. T6',
                        description: '1x A6M 6x 200 A CT',
                        lat: -27.9624495,
                        lng: 153.3817313,
                        type: 'wattwatcher',
                        interval: 300,
                        status: 'offline',
                        active_from: '',
                        circuit_details: [
                            {
                                name: 't6',
                                label: 'T6 Circuit',
                            },
                        ],
                        channel_details: [
                            {
                                label: 'T6 Phase 1',
                                circuit_name: 't6',
                            },
                            {
                                label: 'T6 Phase 2',
                                circuit_name: 't6',
                            },
                            {
                                label: 'T6 Phase 3',
                                circuit_name: 't6',
                            },
                            {
                                label: 'T6 Phase 4',
                                circuit_name: 't6',
                            },
                            {
                                label: 'T6 Phase 5',
                                circuit_name: 't6',
                            },
                            {
                                label: 'T6 Phase 6',
                                circuit_name: 't6',
                            },
                        ],
                        ...(addSecret ? { api_key: 'api key 4' } : {}),
                    },
                    'meter-5': {
                        name: 'meter-5',
                        meter_id: '',
                        label: '5. T7',
                        description: '1x A6M 6x 200 A CT',
                        lat: -27.9624495,
                        lng: 153.3817313,
                        type: 'wattwatcher',
                        interval: 300,
                        status: 'offline',
                        active_from: '',
                        circuit_details: [
                            {
                                name: 't7',
                                label: 'T7 Circuit',
                            },
                        ],
                        channel_details: [
                            {
                                label: 'T7 Phase 1',
                                circuit_name: 't7',
                            },
                            {
                                label: 'T7 Phase 2',
                                circuit_name: 't7',
                            },
                            {
                                label: 'T7 Phase 3',
                                circuit_name: 't7',
                            },
                        ],
                        ...(addSecret ? { api_key: 'api key 5' } : {}),
                    },
                    'meter-6': {
                        name: 'meter-6',
                        meter_id: '',
                        label: '6. Mech Services',
                        description: '1x A6M 6x 400 A CT',
                        lat: -27.9624495,
                        lng: 153.3817313,
                        type: 'wattwatcher',
                        interval: 300,
                        status: 'offline',
                        active_from: '',
                        circuit_details: [
                            {
                                name: 'mesh',
                                label: 'Mesh Circuit',
                            },
                        ],
                        channel_details: [
                            {
                                label: 'Mesh Phase 1',
                                circuit_name: 'mesh',
                            },
                            {
                                label: 'Mesh Phase 2',
                                circuit_name: 'mesh',
                            },
                            {
                                label: 'Mesh Phase 3',
                                circuit_name: 'mesh',
                            },
                        ],
                        ...(addSecret ? { api_key: 'api key 6' } : {}),
                    },
                    'meter-7': {
                        name: 'meter-7',
                        meter_id: '',
                        label: '7. T2 and T5',
                        description: '1x A6M 6x 400 A CT',
                        lat: -27.9624495,
                        lng: 153.3817313,
                        type: 'wattwatcher',
                        interval: 300,
                        status: 'offline',
                        active_from: '',
                        circuit_details: [
                            {
                                name: 't2',
                                label: 'T2 Circuit',
                            },
                            {
                                name: 't5',
                                label: 'T5 Circuit',
                            },
                        ],
                        channel_details: [
                            {
                                label: 'T2 Phase 1',
                                circuit_name: 't2',
                            },
                            {
                                label: 'T2 Phase 2',
                                circuit_name: 't2',
                            },
                            {
                                label: 'T2 Phase 3',
                                circuit_name: 't2',
                            },
                            {
                                label: 'T5 Phase 1',
                                circuit_name: 't5',
                            },
                            {
                                label: 'T5 Phase 2',
                                circuit_name: 't5',
                            },
                            {
                                label: 'T5 Phase 3',
                                circuit_name: 't5',
                            },
                        ],
                        ...(addSecret ? { api_key: 'api key 7' } : {}),
                    },
                },
                solar_details: {
                    'solar-1': {
                        name: 'solar-1',
                        label: '',
                        meter_id: '',
                        ac_capacity: 0,
                        dc_capacity: 0,
                        tracking: 'fixed',
                        inverter_url: '',
                        ...(addSecret ? { inverter_key: 'inverter key 1' } : {}),
                    },
                },
            },
        },
        user_details: {
            'admin@cohort.com': {
                email: 'admin@cohort.com',
                roles: ['admin'],
                ...(addSecret ? { password: 'password 1' } : {}),
            },
            'cohort.staff1@cohort.com': {
                email: 'cohort.staff1@cohort.com',
                roles: ['cohort-staff'],
                ...(addSecret ? { password: 'password 2' } : {}),
            },
            'qld.gov.staff1@cohort.com': {
                email: 'qld.gov.staff1@cohort.com',
                roles: ['qld-government-staff'],
                ...(addSecret ? { password: 'password 3' } : {}),
            },
        },
        secrets_hash: 'hash 1',
    };
}
//# sourceMappingURL=validateBootstrap.test.js.map