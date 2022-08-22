export function safeJsonStringify(
  value: any,
  space?: string | number,
  ignoredKeys?: string[],
): string {
  return JSON.stringify(value, getCircularReplacer(ignoredKeys), space);
}

function getCircularReplacer(
  ignoredKeys?: string[],
): (key: any, value: any) => any {
  const seen = new WeakSet();
  return (key: any, value: any) => {
    if (ignoredKeys && ignoredKeys.indexOf(key) > -1) {
      if (typeof value === 'object' && value !== null) {
        return Object.keys(value);
      }
      return typeof value;
    }

    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
}
