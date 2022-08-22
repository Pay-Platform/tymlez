"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-promise-executor-return */
const fake_timers_1 = __importDefault(require("@sinonjs/fake-timers"));
const common_libs_1 = require("@tymlez/common-libs");
const withAwsLambdaTimeout_1 = require("./withAwsLambdaTimeout");
let clock;
beforeAll(() => {
    clock = fake_timers_1.default.install({
        shouldAdvanceTime: true,
    });
});
afterAll(() => {
    clock.uninstall();
});
describe('withAwsLambdaTimeout', () => {
    describe('given no context object, inner function return immediately', () => {
        const innerFunc = jest.fn().mockResolvedValue({ result: 2 });
        let response;
        beforeAll(() => {
            const func = (0, withAwsLambdaTimeout_1.withAwsLambdaTimeout)({
                func: innerFunc,
                functionName: 'innerFunc',
            });
            response = func({ input: 1 });
        });
        it('should call inner function once pass through the parameters and result', async () => {
            expect(innerFunc).toBeCalledTimes(1);
            expect(innerFunc.mock.calls[0]).toEqual([{ input: 1 }]);
            await expect(response).resolves.toEqual({
                result: 2,
            });
        });
    });
    describe('given no context object, inner function throw error', () => {
        const innerFunc = jest.fn().mockRejectedValue({ error: 3 });
        let response;
        beforeAll(() => {
            const func = (0, withAwsLambdaTimeout_1.withAwsLambdaTimeout)({
                func: innerFunc,
                functionName: 'innerFunc',
            });
            response = func({ input: 1 });
        });
        it('should call inner function once pass through the parameters and error', async () => {
            expect(innerFunc).toBeCalledTimes(1);
            expect(innerFunc.mock.calls[0]).toEqual([{ input: 1 }]);
            await expect(response).rejects.toEqual({
                error: 3,
            });
        });
    });
    describe('given no context object, inner function return after 6 seconds', () => {
        const innerFunc = jest.fn().mockImplementation(async () => {
            await (0, common_libs_1.waitFor)(6000);
            return { result: 2 };
        });
        let response;
        beforeAll(() => {
            const func = (0, withAwsLambdaTimeout_1.withAwsLambdaTimeout)({
                func: innerFunc,
                functionName: 'innerFunc',
            });
            response = func({ input: 1 });
            clock.tick(6000);
        });
        it('should call inner function once pass through the parameters and result', async () => {
            expect(innerFunc).toBeCalledTimes(1);
            expect(innerFunc.mock.calls[0]).toEqual([{ input: 1 }]);
            await expect(response).resolves.toEqual({
                result: 2,
            });
        });
    });
    describe(`given context.getRemainingTimeInMillis() returns 3 seconds,
      inner function return after 6 seconds`, () => {
        const innerFunc = jest.fn().mockImplementation(async () => {
            await (0, common_libs_1.waitFor)(6000);
            return { result: 2 };
        });
        const context = {
            getRemainingTimeInMillis: () => 3000,
        };
        let response;
        beforeAll(() => {
            const func = (0, withAwsLambdaTimeout_1.withAwsLambdaTimeout)({
                func: innerFunc,
                functionName: 'innerFunc',
            });
            response = func({ input: 1 }, context);
            clock.tick(6000);
        });
        it('should call inner function once pass through the parameters and result', async () => {
            expect(innerFunc).toBeCalledTimes(1);
            expect(innerFunc.mock.calls[0]).toEqual([{ input: 1 }, context]);
            await expect(response).resolves.toEqual({
                result: 2,
            });
        });
    });
    describe(`given context.getRemainingTimeInMillis() returns 30 seconds,
      inner function return after 60 seconds`, () => {
        const innerFunc = jest.fn().mockImplementation(async () => {
            await (0, common_libs_1.waitFor)(6000);
            return { result: 2 };
        });
        const context = {
            getRemainingTimeInMillis: () => 30000,
        };
        let response;
        beforeAll(() => {
            const func = (0, withAwsLambdaTimeout_1.withAwsLambdaTimeout)({
                func: innerFunc,
                functionName: 'innerFunc',
            });
            response = func({ input: 1 }, context);
            clock.tick(60000);
        });
        it('should call inner function once pass through the parameters, but timeout after 20 seconds', async () => {
            expect(innerFunc).toBeCalledTimes(1);
            expect(innerFunc.mock.calls[0]).toEqual([{ input: 1 }, context]);
            await expect(response).rejects.toThrow(/Promise timed out after 24000 milliseconds/);
        });
    });
});
//# sourceMappingURL=withAwsLambdaTimeout.test.js.map