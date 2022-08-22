/* eslint-disable no-promise-executor-return */
import FakeTimers from '@sinonjs/fake-timers';
import { waitFor } from '@tymlez/common-libs';
import { restoreConsole, suppressConsole } from '@tymlez/test-libs/src/jest';
import { withAwsLambdaTimeout } from './withAwsLambdaTimeout';

let clock: FakeTimers.InstalledClock;
beforeAll(() => {
  clock = FakeTimers.install({
    shouldAdvanceTime: true,
  });
});

afterAll(() => {
  clock.uninstall();
});

beforeAll(() => {
  suppressConsole({ debug: false });
});

afterAll(() => {
  restoreConsole();
});

describe('withAwsLambdaTimeout', () => {
  describe('given no context object, inner function return immediately', () => {
    const innerFunc = jest.fn().mockResolvedValue({ result: 2 });

    let response: Promise<unknown>;

    beforeAll(() => {
      const func = withAwsLambdaTimeout({
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

    let response: Promise<unknown>;

    beforeAll(() => {
      const func = withAwsLambdaTimeout({
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
      await waitFor(6000);
      return { result: 2 };
    });

    let response: any;
    beforeAll(() => {
      const func = withAwsLambdaTimeout({
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
      await waitFor(6000);
      return { result: 2 };
    });
    const context = {
      getRemainingTimeInMillis: () => 3000,
    };

    let response: Promise<unknown>;

    beforeAll(() => {
      const func = withAwsLambdaTimeout({
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
      await waitFor(6000);
      return { result: 2 };
    });
    const context = {
      getRemainingTimeInMillis: () => 30_000,
    };

    let response: Promise<unknown>;

    beforeAll(() => {
      const func = withAwsLambdaTimeout({
        func: innerFunc,
        functionName: 'innerFunc',
      });

      response = func({ input: 1 }, context);
      clock.tick(60_000);
    });

    it('should call inner function once pass through the parameters, but timeout after 20 seconds', async () => {
      expect(innerFunc).toBeCalledTimes(1);
      expect(innerFunc.mock.calls[0]).toEqual([{ input: 1 }, context]);
      await expect(response).rejects.toThrow(
        /Promise timed out after 24000 milliseconds/,
      );
    });
  });
});
