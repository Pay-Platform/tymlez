import { AssertionError } from 'assert';
import pLimit from 'p-limit';
import { safeJsonStringify } from '../json/safeJsonStringify';

export async function runAllSettled<TInput, TOutput>(
  inputs: (TInput | Error)[],
  callback: (input: TInput, index: number) => Promise<TOutput>,
  concurrency = 8,
): Promise<(TOutput | Error)[]> {
  const limit = pLimit(concurrency);

  const results = await Promise.allSettled(
    inputs.map((input, index) =>
      limit(async () => {
        if (input instanceof Error) {
          return input;
        }
        return callback(input, index);
      }),
    ),
  );

  return results.map((result) => {
    if (result.status === 'rejected') {
      if (result.reason instanceof Error) {
        return result.reason;
      }

      // https://github.com/facebook/jest/issues/7547
      if (result.reason instanceof AssertionError) {
        return new Error(result.reason.message);
      }

      return new Error(`Unknown error.\n${safeJsonStringify(result.reason)}`);
    }

    return result.value;
  });
}
