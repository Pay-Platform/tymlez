import { uniq } from 'lodash';

export function getShallowDiff(
  prevProps: Record<string, any>,
  nextProps: Record<string, any>,
) {
  return uniq([...Object.keys(prevProps), ...Object.keys(nextProps)]).reduce(
    (accumulator, key) => {
      if (prevProps[key] !== nextProps[key]) {
        accumulator.push({ key, prev: prevProps[key], next: nextProps[key] });
      }
      return accumulator;
    },
    [] as { key: string; prev: any; next: any }[],
  );
}
