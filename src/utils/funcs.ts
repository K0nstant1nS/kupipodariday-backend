export function configureDigitsAfterDot(
  int: number,
  maxDigitsCount: number,
): number {
  return String(int).split('.').length > 1 &&
    String(int).split('.')[1].length > maxDigitsCount
    ? Number(int.toFixed(maxDigitsCount))
    : int;
}
