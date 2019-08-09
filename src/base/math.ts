export function toPercentage(molecular: number, denominator: number, decimalPoint: number = 1) {
  const a = Math.pow(10, decimalPoint);
  return Math.floor(molecular / denominator * 100 * a) / a;
}
