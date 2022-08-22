import type { ITimeSpanMsec } from '@tymlez/platform-api-interfaces';
import assert from 'assert';
import pTimeout from 'p-timeout';

export function withTimeout<T extends any[], U>({
  func,
  functionName,
  rawTimeout,
  timeBuffer = 6_000,
}: {
  func: (...args: T) => PromiseLike<U>;
  functionName: string;

  /**
   * Serverless function runtime timeout without buffer
   */
  rawTimeout: ITimeSpanMsec;
  /**
   * Time buffer to allow JavaScript error handling to run before
   * the serverless function runtime timeout
   */
  timeBuffer?: ITimeSpanMsec;
}): (...args: T) => Promise<U> {
  const timeout = rawTimeout - timeBuffer;
  assert(
    timeout > 0,
    `${functionName}: timeout is ${timeout} ms, expect larger than 0.`,
  );

  return async (...args) => {
    return await pTimeout(func(...args), timeout);
  };
}
