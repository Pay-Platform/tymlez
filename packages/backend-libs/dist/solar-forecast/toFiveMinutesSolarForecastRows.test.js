"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const toFiveMinutesSolarForecastRows_1 = require("./toFiveMinutesSolarForecastRows");
describe('toFiveMinutesSolarForecastRows', () => {
    it('should return empty array if 30 minutes data is empty', () => {
        expect((0, toFiveMinutesSolarForecastRows_1.toFiveMinutesSolarForecastRows)({
            thirtyMinutesSolarForecastRows: [],
        })).toEqual([]);
    });
    it('should return 6 item array if 30 minutes data has 1 row', () => {
        const now = new Date();
        expect((0, toFiveMinutesSolarForecastRows_1.toFiveMinutesSolarForecastRows)({
            thirtyMinutesSolarForecastRows: [
                {
                    forecasted_on: now,
                    period: 'PT30M',
                    period_end: new Date('2022-01-01T00:00:00Z'),
                    pv_estimate: 120,
                    pv_estimate10: 60,
                    pv_estimate90: 180,
                    requestId: 'requestId 1',
                    resource_id: 'resource_id 1',
                },
            ],
        })).toMatchObject([
            {
                period_end: new Date('2022-01-01T00:00:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:05:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:10:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:15:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:20:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:25:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
        ]);
    });
    it('should return 12 item array if 30 minutes data has 2 rows', () => {
        const now = new Date();
        expect((0, toFiveMinutesSolarForecastRows_1.toFiveMinutesSolarForecastRows)({
            thirtyMinutesSolarForecastRows: [
                {
                    forecasted_on: now,
                    period: 'PT30M',
                    period_end: new Date('2022-01-01T00:00:00Z'),
                    pv_estimate: 120,
                    pv_estimate10: 60,
                    pv_estimate90: 180,
                    requestId: 'requestId 1',
                    resource_id: 'resource_id 1',
                },
                {
                    forecasted_on: now,
                    period: 'PT30M',
                    period_end: new Date('2022-01-01T00:30:00Z'),
                    pv_estimate: 0.12,
                    pv_estimate10: 0.06,
                    pv_estimate90: 0.18,
                    requestId: 'requestId 1',
                    resource_id: 'resource_id 1',
                },
            ],
        })).toMatchObject([
            // 1st 30-minute period
            {
                period_end: new Date('2022-01-01T00:00:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:05:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:10:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:15:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:20:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            {
                period_end: new Date('2022-01-01T00:25:00Z'),
                pv_estimate: 20,
                pv_estimate10: 10,
                pv_estimate90: 30,
            },
            // 2nd 30-minute period
            {
                period_end: new Date('2022-01-01T00:30:00Z'),
                pv_estimate: 0.02,
                pv_estimate10: 0.01,
                pv_estimate90: 0.03,
            },
            {
                period_end: new Date('2022-01-01T00:35:00Z'),
                pv_estimate: 0.02,
                pv_estimate10: 0.01,
                pv_estimate90: 0.03,
            },
            {
                period_end: new Date('2022-01-01T00:40:00Z'),
                pv_estimate: 0.02,
                pv_estimate10: 0.01,
                pv_estimate90: 0.03,
            },
            {
                period_end: new Date('2022-01-01T00:45:00Z'),
                pv_estimate: 0.02,
                pv_estimate10: 0.01,
                pv_estimate90: 0.03,
            },
            {
                period_end: new Date('2022-01-01T00:50:00Z'),
                pv_estimate: 0.02,
                pv_estimate10: 0.01,
                pv_estimate90: 0.03,
            },
            {
                period_end: new Date('2022-01-01T00:55:00Z'),
                pv_estimate: 0.02,
                pv_estimate10: 0.01,
                pv_estimate90: 0.03,
            },
        ]);
    });
});
//# sourceMappingURL=toFiveMinutesSolarForecastRows.test.js.map