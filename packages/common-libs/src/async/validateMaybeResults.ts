import { some, zip } from 'lodash';
import { logMaybeErrors } from '../log/logMaybeErrors';

export function validateMaybeResults({
  message,
  inputs,
  results,
}: {
  message: string;
  inputs: any[];
  results: (void | Object | Error)[];
}) {
  logMaybeErrors({ results, inputs, message });

  if (some(results, (result) => result instanceof Error)) {
    const errors = results
      .filter((result): result is Error => result instanceof Error)
      .map((result) => (result.message ? result.message : String(result)));

    throw new Error(
      `${message}\n${JSON.stringify(zip(inputs, errors), undefined, 2)}`,
    );
  }
}
