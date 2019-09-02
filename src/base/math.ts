export function toPercentage(molecular: number, denominator: number, decimalPoint: number = 1) {
  const a = Math.pow(10, decimalPoint);
  if (denominator === 0) {
    return 0;
  }
  return Math.floor(molecular / denominator * 100 * a) / a;
}

export function cuttingPoint(value: number, decimalPoint: number) {
  const a = Math.pow(10, decimalPoint);
  return Math.floor(value * a) / a;
}
