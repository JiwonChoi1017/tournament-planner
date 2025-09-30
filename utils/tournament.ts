import { Match, Participant } from "@/types/common";

import { MATCH_RESULT } from "@/constants/commonConstant";

/**
 * 1回戦を除いた総ラウンド数を算出する。
 * @param {number} initParticipantNum 初期参加者数
 * @returns {number} 1回戦を除いた総ラウンド数
 */
const calculateTotalRoundNumExceptFirstRound = (
  initParticipantNum: number
): number => {
  let totalRoundNum = 0;
  let currentParticipantNum = initParticipantNum;

  while (currentParticipantNum > 0) {
    totalRoundNum += currentParticipantNum;
    currentParticipantNum = Math.floor(currentParticipantNum / 2);
  }

  return totalRoundNum;
};

/**
 * トーナメントの総ラウンド数を算出する。
 * 参加者数に基づいて総ラウンド数を計算する。
 * @param {number} maxPower 2の累乗の最大値（参加者数を超える最小の2の累乗）
 * @param {number} minPower 2の累乗の最小値（参加者数を下回る最大の2の累乗）
 * @param {number} totalParticipantNum 総参加者数
 * @returns {number} 総ラウンド数
 */
const calculateTotalRoundNum = (
  maxPower: number,
  minPower: number,
  totalParticipantNum: number
): number => {
  const maxPowerValue = 2 ** maxPower;
  const minPowerValue = 2 ** minPower;
  const upperDifference = maxPowerValue - totalParticipantNum;
  const lowerDifference = totalParticipantNum - minPowerValue;

  // 上位の2の累乗に近いか、下位の2の累乗に近いかで計算方法を決定
  if (upperDifference >= lowerDifference) {
    const totalRoundNumExceptFirstRound =
      minPower - 2 >= 0
        ? calculateTotalRoundNumExceptFirstRound(2 ** (minPower - 2))
        : 0;
    // 上位の2の累乗に近い場合
    return (
      Math.floor(2 ** (minPower - 1)) +
      lowerDifference +
      totalRoundNumExceptFirstRound
    );
  } else {
    const totalRoundNumExceptFirstRound =
      minPower - 1 >= 0
        ? calculateTotalRoundNumExceptFirstRound(2 ** (minPower - 1))
        : 0;
    // 下位の2の累乗に近い場合
    return lowerDifference + totalRoundNumExceptFirstRound;
  }
};

/**
 * 与えられた数値が2のべき乗かを判定する。
 * @param {number} num 入力値
 * @returns {boolean} 2のべき乗ならtrue、そうでなければfalse
 */
const isPowerOfTwo = (num: number): boolean =>
  num > 0 && (num & (num - 1)) === 0;

/**
 * オブジェクトから`result`プロパティを取り除いた新しいオブジェクトを返す。
 * @template T extends { result?: unknown }
 * @param {T} [obj] 任意のオブジェクト（任意）
 * @returns {Omit<T, "result"> | undefined} `result`を除外したオブジェクト（未指定時はundefined）
 */
const omitResult = <T extends { result?: unknown }>(
  obj?: T
): Omit<T, "result"> | undefined => {
  if (!obj) return undefined;
  const { result: _omit, ...rest } = obj;
  return rest as Omit<T, "result">;
};

/**
 * 参加者配列をFisher–Yates法でシャッフルする。
 * @template T
 * @param {T[]} participantArray 参加者配列
 * @returns {T[]} シャッフル済みの参加者配列
 */
const shuffleParticipants = <T>(participantArray: T[]): T[] => {
  const shuffledParticipantArr = [...participantArray];
  for (let i = shuffledParticipantArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledParticipantArr[i], shuffledParticipantArr[j]] = [
      shuffledParticipantArr[j],
      shuffledParticipantArr[i],
    ];
  }

  return shuffledParticipantArr;
};

/**
 * 総シード選手数を算出する。
 * 上位の2の累乗までの不足分と、下位の2の累乗からの超過分を比較し、
 * より小さい方をシード数とする。
 * @param {number} maxPower 2の累乗の最大値（参加者数を超える最小の2の累乗）
 * @param {number} minPower 2の累乗の最小値（参加者数を下回る最大の2の累乗）
 * @param {number} totalParticipantNum 総参加者数
 * @returns {number} 総シード選手数
 */
const calculateTotalSeedPlayerNum = (
  maxPower: number,
  minPower: number,
  totalParticipantNum: number
): number => {
  const upperDifference = 2 ** maxPower - totalParticipantNum;
  const lowerDifference = totalParticipantNum - 2 ** minPower;
  return upperDifference > lowerDifference ? lowerDifference : upperDifference;
};

/**
 * 1回戦の対戦カード配列を生成する。
 * シード選手をBYEとして交互に配置し、残りの参加者で試合を埋める。
 * @param {number} participantNum 1回戦に割り当てる参加者数
 * @param {number} seedPlayerNum シード選手数（BYE数）
 * @returns {Match[]} 1回戦の対戦カード配列
 */
const createFirstRoundArray = (
  participantNum: number,
  seedPlayerNum: number
): Match[] => {
  let remainParticipantNum = participantNum;
  const matches: Match[] = [];

  for (let i = 0; i < seedPlayerNum; i++) {
    if (i % 2 === 0) {
      matches.push({
        player1: {
          result: MATCH_RESULT.BYE,
        },
        nextRound: undefined,
      });
      matches.push({
        player1: undefined,
        player2: undefined,
        currentRound: 0,
        nextRound: undefined,
      });
    } else {
      matches.push({
        player1: undefined,
        player2: undefined,
        currentRound: 0,
        nextRound: undefined,
      });
      matches.push({
        player2: {
          result: MATCH_RESULT.BYE,
        },
        nextRound: undefined,
      });
    }
    remainParticipantNum -= 3;
  }

  if (remainParticipantNum) {
    for (let i = 0; i < remainParticipantNum; i += 2) {
      matches.push({
        player1: undefined,
        player2: undefined,
      });
    }
  }

  const totalMatchNum = matches.length;
  let remainMatchNum = totalMatchNum;
  let remainingSeedPlayersCount = seedPlayerNum;
  const sortedMatches: Match[] = new Array(totalMatchNum);
  let front = 0;
  let back = totalMatchNum - 1;
  let matchIndex = 0;

  while (remainMatchNum > 0) {
    if (!remainingSeedPlayersCount) {
      sortedMatches[front++] = matches[matchIndex++];
      remainMatchNum--;
    } else {
      for (let i = 0; i < seedPlayerNum; i++) {
        if (i % 2 === 0) {
          sortedMatches[front++] = matches[i * 2];
          sortedMatches[front++] = matches[i * 2 + 1];
        } else {
          sortedMatches[back--] = matches[i * 2 + 1];
          sortedMatches[back--] = matches[i * 2];
        }
        matchIndex += 2;
        remainMatchNum -= 2;
        remainingSeedPlayersCount--;

        if (!remainingSeedPlayersCount) {
          break;
        }
      }
    }
  }

  return sortedMatches;
};

/**
 * 全ての対戦カードを生成する。
 * 総参加者数、シード数、参加者名リストに基づき、各ラウンドの対戦を構築する。
 * @param {number} totalParticipantNum 総参加者数
 * @param {string[]} participantList 参加者の配列（任意）
 * @param {boolean} needToShuffleParticipants 参加者割当て時にシャッフルするか（任意）
 * @returns {Map<number, Match[]>} ラウンドIDをキーとした対戦カードのマップ
 */
export const createTotalMatch = (
  totalParticipantNum: number,
  participantList?: string[],
  needToShuffleParticipants?: boolean
): Map<number, Match[]> => {
  const maxPower = Math.ceil(Math.log2(totalParticipantNum));
  const minPower = maxPower - 1;
  const seedPlayerNum = calculateTotalSeedPlayerNum(
    maxPower,
    minPower,
    totalParticipantNum
  );
  const totalRoundNum = calculateTotalRoundNum(
    maxPower,
    minPower,
    totalParticipantNum
  );

  let round = 1;
  let matches: Match[] = [];
  let remainRoundNum = totalRoundNum;

  if (isPowerOfTwo(totalParticipantNum)) {
    for (let i = 0; i < totalParticipantNum; i += 2) {
      matches.push({
        player1: undefined,
        player2: undefined,
        currentRound: round++,
      });
      remainRoundNum--;
    }
  } else {
    let firstRoundArray: Match[] = [];

    // 左配列の鏡像生成
    const mirrorLeftToRight = (left: Match[]): Match[] => {
      const right: Match[] = [];
      for (let i = left.length - 1; i >= 0; i--) {
        const item = left[i];
        if (!("player1" in item)) {
          right.push({ player1: { ...item.player2 }, nextRound: undefined });
        } else if (!("player2" in item)) {
          right.push({ player2: { ...item.player1 }, nextRound: undefined });
        } else {
          right.push(item);
        }
      }
      return right;
    };

    if (totalParticipantNum % 2 === 0) {
      const leftArrayNum = totalParticipantNum / 2;
      const leftSeedPlayerNum = seedPlayerNum / 2;
      const leftArray = createFirstRoundArray(leftArrayNum, leftSeedPlayerNum);
      const rightArray = mirrorLeftToRight(leftArray);
      firstRoundArray = [...leftArray, ...rightArray];
    } else if (totalParticipantNum < 4) {
      const leftArrayNum = Math.ceil(totalParticipantNum / 2);
      const leftArray = createFirstRoundArray(leftArrayNum, seedPlayerNum);
      firstRoundArray = [...leftArray];
    } else {
      const leftArrayNum =
        totalParticipantNum % 4 === 1
          ? Math.ceil(totalParticipantNum / 2)
          : Math.floor(totalParticipantNum / 2);
      const leftSeedPlayerNum =
        totalParticipantNum % 4 === 1
          ? Math.ceil(seedPlayerNum / 2)
          : Math.floor(seedPlayerNum / 2);
      const rightSeedPlayerNum = seedPlayerNum - leftSeedPlayerNum;

      const dominantSeed =
        leftSeedPlayerNum >= rightSeedPlayerNum
          ? leftSeedPlayerNum
          : rightSeedPlayerNum;
      const minoritySeed =
        leftSeedPlayerNum < rightSeedPlayerNum
          ? leftSeedPlayerNum
          : rightSeedPlayerNum;

      const leftArray = createFirstRoundArray(leftArrayNum, dominantSeed);
      const rightArrayNum = totalParticipantNum - leftArrayNum;
      const rightArray = createFirstRoundArray(rightArrayNum, minoritySeed);

      firstRoundArray = [...leftArray, ...rightArray];
    }

    matches = firstRoundArray.map((value) => {
      const isFullMatch = "player1" in value && "player2" in value;
      const isCurrentUnset = !("currentRound" in value);
      const canDeferWithPowerOfTwo = isPowerOfTwo(
        (totalParticipantNum - seedPlayerNum * 3) / 2 + seedPlayerNum
      );

      if (isFullMatch) {
        if (isCurrentUnset && canDeferWithPowerOfTwo) {
          return { ...value, nextRound: undefined };
        }
        remainRoundNum--;
        return { ...value, currentRound: round++ };
      }
      return { ...value };
    });
  }

  const usedParticipantIds = new Set<number>();
  let nextRound = round;

  const participantObjects: Participant[] = participantList
    ? (needToShuffleParticipants
        ? shuffleParticipants<string>(participantList)
        : participantList
      ).map((value, index) => {
        return {
          id: index,
          name: value,
        };
      })
    : [];

  // 割当て対象を取得
  const takeNextAvailableParticipant = (): Participant | undefined => {
    const target = participantObjects.find(
      (p) => typeof p.id === "number" && !usedParticipantIds.has(p.id)
    );
    if (target && typeof target.id === "number") {
      usedParticipantIds.add(target.id);
      return target;
    }
    return undefined;
  };

  // 参加者の割当て
  const assignParticipantsToMatch = (matchIndex: number): void => {
    if (!participantObjects) return;
    if ("player1" in matches[matchIndex]) {
      const next = takeNextAvailableParticipant();
      if (next) {
        matches[matchIndex].player1 = {
          ...matches[matchIndex].player1,
          ...next,
        };
      }
    }
    if ("player2" in matches[matchIndex]) {
      const next = takeNextAvailableParticipant();
      if (next) {
        matches[matchIndex].player2 = {
          ...matches[matchIndex].player2,
          ...next,
        };
      }
    }
  };

  // 次のラウンドの割当てとペア完了時の進行
  const ensureNextRoundAssignment = (matchIndex: number): void => {
    if (
      "player1" in matches[matchIndex] &&
      "player2" in matches[matchIndex] &&
      !matches[matchIndex].currentRound
    ) {
      matches[matchIndex].nextRound = nextRound++;
    } else {
      matches[matchIndex] = { ...matches[matchIndex], nextRound };
      const pairedCount = matches.reduce(
        (acc, m) => acc + (m.nextRound === nextRound ? 1 : 0),
        0
      );
      if (pairedCount === 2) {
        nextRound++;
      }
    }
  };

  if (totalParticipantNum === 2) {
    assignParticipantsToMatch(0);
  } else {
    while (matches.some((m) => !m.nextRound)) {
      for (let i = 0; i < matches.length; i++) {
        ensureNextRoundAssignment(i);
        assignParticipantsToMatch(i);
      }
    }
  }

  const result = new Map<number, Match[]>();
  let matchId = 0;
  result.set(matchId++, matches);

  while (remainRoundNum > 0) {
    // 現ラウンドで生成する試合一覧
    const currentRoundMatches: Match[] = [];
    const currentRemaining = remainRoundNum;
    // 現在の残り数以下の最大の2の冪
    const largestPowerOfTwoLE = 2 ** Math.trunc(Math.log2(currentRemaining));
    let shouldContinue = false;

    for (let i = currentRemaining; i >= largestPowerOfTwoLE; i--) {
      const newMatch: Match = { currentRound: round };
      const lastRoundMatches = Array.from(result.values()).pop();
      const prevRoundElement = lastRoundMatches?.find(
        (value) => value.nextRound === round && !value.currentRound
      );
      if (prevRoundElement) {
        newMatch.player1 = omitResult(prevRoundElement.player1!);
        newMatch.player2 = omitResult(prevRoundElement.player2!);
      }
      currentRoundMatches.push(newMatch);
      round++;
      remainRoundNum--;
      if (i === remainRoundNum) {
        shouldContinue = true;
        break;
      }
    }

    if (shouldContinue) {
      continue;
    }

    if (currentRoundMatches.length > 1) {
      for (let i = 0; i < currentRoundMatches.length; i += 2) {
        currentRoundMatches[i] = { ...currentRoundMatches[i], nextRound };
        currentRoundMatches[i + 1] = {
          ...currentRoundMatches[i + 1],
          nextRound,
        };
        nextRound++;
      }
    }

    result.set(matchId++, currentRoundMatches);
  }

  return result;
};
