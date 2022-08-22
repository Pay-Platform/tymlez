import pRetry, { Options } from 'p-retry';

export function asyncRetry<T>(
  input: (attemptCount: number) => PromiseLike<T> | T,
  options?: Options,
): Promise<T> {
  return pRetry(input, options);
}
