import { clone } from 'lodash';
import { useRef } from 'react';
import { getShallowDiff } from './getShallowDiff';

export function useDebugDataDiff({
  label,
  data,
  verbose,
}: {
  label: string;
  data: Record<string, any>;
  verbose?: boolean;
}) {
  const previousDataRef = useRef<Record<string, any>>({});

  const diffs = getShallowDiff(previousDataRef.current, data);
  if (diffs.length > 0) {
    if (verbose) {
      console.info(`${label} - changed data:`, diffs);
    } else {
      console.info(
        `${label} - changed data:`,
        diffs.map((diff) => diff.key),
      );
    }
  } else if (verbose) {
    console.info(`${label} - no data changed`);
  }

  previousDataRef.current = clone(data);
}
