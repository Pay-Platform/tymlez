export function isNumeric(value: any): boolean {
  if (typeof value === 'number') {
    return !isNaN(value);
  }

  if (typeof value === 'string') {
    return !isNaN(value as any) && !isNaN(parseFloat(value));
  }

  return false;
}
