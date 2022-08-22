import { uniqBy } from 'lodash';

export function hasDuplicates<T>(
  items: T[],
  iteratee: (item: T) => string | number,
) {
  return uniqBy(items, iteratee).length !== items.length;
}
