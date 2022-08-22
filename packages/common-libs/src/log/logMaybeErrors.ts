import { some, zip } from 'lodash';
import { safeJsonStringify } from '../json/safeJsonStringify';

export function logMaybeErrors({
  message,
  inputs,
  results,
}: {
  message: string;
  inputs: any[];
  results: (void | Object | Error)[];
}): void {
  if (!some(results, (result) => result instanceof Error)) {
    return;
  }

  if (inputs.length === results.length) {
    console.error(
      message,
      `results count: ${results.length}`,
      safeJsonStringify(
        zip(inputs, results)
          .filter((s): s is [any, Error] => s[1] instanceof Error)
          .map(([input, error]) => {
            return {
              input,
              errorMessage: error.message ? error.message : error.toString(),
              error,
            };
          }),
        2,
      ),
    );
  } else {
    console.error(
      message,
      `inputs count: ${inputs.length}, results count: ${results.length}`,
      inputs,
      safeJsonStringify(
        results.map((result) => {
          if (!(result instanceof Error)) {
            return undefined;
          }

          const error = result;

          return {
            errorMessage: error.message ? error.message : error.toString(),
            error,
          };
        }),
        2,
      ),
    );
  }
}
