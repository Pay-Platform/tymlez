export function formatNumber(n: number, digits = 2) {
  if (typeof n === 'number') {
    return (+n.toFixed(digits)).toLocaleString('en-US', {
      maximumFractionDigits: digits,
    });
  }
  return 0;
}
