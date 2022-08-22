"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const validateDurationBetweenTimestamps_1 = require("./validateDurationBetweenTimestamps");
const makeHasKnownErrorInMeterOrCarbon_1 = require("./makeHasKnownErrorInMeterOrCarbon");
describe('validateDurationBetweenTimestamps', () => {
    it('should pass when duration between all items match expected duration', () => {
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: 'DDA4108814035',
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T05:15:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:20:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:25:00.000Z'),
                },
            ],
            expectedDuration: 300000,
            knownErrorsMap: constants_1.KNOWN_WATTWATCHERS_ERRORS_MAP,
        })).not.toThrowError();
    });
    it('should fail when duration between some items does not match expected duration', () => {
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: 'DDA4108814035',
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T06:00:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T06:10:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T06:15:00.000Z'),
                },
            ],
            expectedDuration: 300000,
            knownErrorsMap: constants_1.KNOWN_WATTWATCHERS_ERRORS_MAP,
        })).toThrowError(/2021-12-22T06:10:00\.000Z.+does not equal to the duration/);
    });
    it('should fail when timestamps are in reverse order', () => {
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: 'DDA4108814035',
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T05:25:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:20:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:15:00.000Z'),
                },
            ],
            expectedDuration: 300000,
            knownErrorsMap: constants_1.KNOWN_WATTWATCHERS_ERRORS_MAP,
        })).toThrowError(/2021-12-22T05:25:00\.000Z.+does not equal to the duration/);
    });
    it('should pass when duration between some items does not match expected duration, which is known error', () => {
        const meterId = 'DDA4108814035';
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: meterId,
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T05:00:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:10:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:15:00.000Z'),
                },
            ],
            expectedDuration: 300000,
            knownErrorsMap: constants_1.KNOWN_WATTWATCHERS_ERRORS_MAP,
        })).not.toThrowError();
    });
    it('should fail when duration between some items does not match expected duration that is not known error', () => {
        const meterId = 'DDA4108814035';
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: meterId,
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T05:00:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:10:00.000Z'),
                },
                {
                    timestamp: new Date('2021-12-22T05:20:00.000Z'),
                },
            ],
            expectedDuration: 300000,
            knownErrorsMap: constants_1.KNOWN_WATTWATCHERS_ERRORS_MAP,
        })).toThrowError(/2021-12-22T05:20:00\.000Z.+does not equal to the duration/);
    });
    it(`should pass when duration between some items does not match expected duration ` +
        `that is not known error`, () => {
        const meterId = 'DDA4108814035';
        const region = 'QLD1';
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: `${meterId}-${region}`,
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T05:00:00.000Z'),
                    meterId,
                    region,
                },
                {
                    timestamp: new Date('2021-12-22T05:10:00.000Z'),
                    meterId,
                    region,
                },
                {
                    timestamp: new Date('2021-12-22T05:15:00.000Z'),
                    meterId,
                    region,
                },
                {
                    timestamp: new Date('2021-12-22T05:25:00.000Z'),
                    meterId,
                    region,
                },
            ],
            expectedDuration: 300000,
            hasKnownError: (0, makeHasKnownErrorInMeterOrCarbon_1.makeHasKnownErrorInMeterOrCarbon)({
                knownMeterErrorsMap: {
                    DDA4108814035: [
                        {
                            item0: new Date('2021-12-22T05:00:00.000Z'),
                            item1: new Date('2021-12-22T05:10:00.000Z'),
                        },
                    ],
                },
                knownCarbonErrorsMap: {
                    QLD1: [
                        {
                            item0: new Date('2021-12-22T05:15:00.000Z'),
                            item1: new Date('2021-12-22T05:25:00.000Z'),
                        },
                    ],
                },
            }),
        })).not.toThrowError();
    });
    it(`should fail when 2 durations do not match expected duration ` +
        `that 1 is known meter error, another is not known`, () => {
        const meterId = 'DDA4108814035';
        const region = 'QLD1';
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: `${meterId}-${region}`,
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T05:00:00.000Z'),
                    meterId,
                    region,
                },
                // missing '2021-12-22T05:05:00.000Z'
                {
                    timestamp: new Date('2021-12-22T05:10:00.000Z'),
                    meterId,
                    region,
                },
                {
                    timestamp: new Date('2021-12-22T05:15:00.000Z'),
                    meterId,
                    region,
                },
                // missing '2021-12-22T05:20:00.000Z'
                {
                    timestamp: new Date('2021-12-22T05:25:00.000Z'),
                    meterId,
                    region,
                },
            ],
            expectedDuration: 300000,
            hasKnownError: (0, makeHasKnownErrorInMeterOrCarbon_1.makeHasKnownErrorInMeterOrCarbon)({
                knownMeterErrorsMap: {
                    DDA4108814035: [
                        {
                            item0: new Date('2021-12-22T05:00:00.000Z'),
                            item1: new Date('2021-12-22T05:10:00.000Z'),
                        },
                    ],
                },
                knownCarbonErrorsMap: {},
            }),
        })).toThrowError(/2021-12-22T05:15:00\.000Z.+does not equal to the duration/);
    });
    it(`should fail when 2 durations do not match expected duration ` +
        `that 1 is known carbon error, another is not known`, () => {
        const meterId = 'DDA4108814035';
        const region = 'QLD1';
        expect(() => (0, validateDurationBetweenTimestamps_1.validateDurationBetweenTimestamps)({
            id: `${meterId}-${region}`,
            ascItems: [
                {
                    timestamp: new Date('2021-12-22T05:00:00.000Z'),
                    meterId,
                    region,
                },
                // missing '2021-12-22T05:05:00.000Z'
                {
                    timestamp: new Date('2021-12-22T05:10:00.000Z'),
                    meterId,
                    region,
                },
                {
                    timestamp: new Date('2021-12-22T05:15:00.000Z'),
                    meterId,
                    region,
                },
                // missing '2021-12-22T05:20:00.000Z'
                {
                    timestamp: new Date('2021-12-22T05:25:00.000Z'),
                    meterId,
                    region,
                },
            ],
            expectedDuration: 300000,
            hasKnownError: (0, makeHasKnownErrorInMeterOrCarbon_1.makeHasKnownErrorInMeterOrCarbon)({
                knownMeterErrorsMap: {},
                knownCarbonErrorsMap: {
                    QLD1: [
                        {
                            item0: new Date('2021-12-22T05:15:00.000Z'),
                            item1: new Date('2021-12-22T05:25:00.000Z'),
                        },
                    ],
                },
            }),
        })).toThrowError(/2021-12-22T05:00:00.000Z.+does not equal to the duration/);
    });
});
//# sourceMappingURL=validateDurationBetweenTimestamps.test.js.map