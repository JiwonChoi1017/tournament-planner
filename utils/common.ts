export const calculateTotal = (num: number): number => {
  let total = 0;
  let currentNum = num;
  while (currentNum > 0) {
    total += currentNum;
    currentNum = Math.floor(currentNum / 2);
  }
  return total;
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

export const shuffleArray = <T>(arr: T[]): T[] => {
  const shuffledArr = [...arr];
  for (let i = shuffledArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
  }

  return shuffledArr;
};
