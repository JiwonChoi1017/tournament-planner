export const sumRounds = (num: number): number => {
  if (num === 0) return 0;
  return num + sumRounds(Math.floor(num / 2));
};

export const isPowerOfTwo = (num: number): boolean =>
  num > 0 && (num & (num - 1)) === 0;

export const omitResult = <T extends { result?: unknown }>(
  obj?: T
): Omit<T, "result"> | undefined => {
  if (!obj) return undefined;
  const { result: _omit, ...rest } = obj;
  return rest as Omit<T, "result">;
};
