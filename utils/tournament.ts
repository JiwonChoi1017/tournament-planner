import { Match, Participant } from "@/types/common";
import {
  calculateTotal,
  isPowerOfTwo,
  omitResult,
  shuffleArray,
} from "./common";

import { MATCH_RESULT } from "@/constants/commonConstant";

const calculateSeedPlayer = (
  maxPower: number,
  minPower: number,
  totalParticipantNum: number
) =>
  2 ** maxPower - totalParticipantNum > totalParticipantNum - 2 ** minPower
    ? totalParticipantNum - 2 ** minPower
    : 2 ** maxPower - totalParticipantNum;

const calculateTotalRoundNum = (
  maxPower: number,
  minPower: number,
  totalParticipantNum: number
) => {
  return 2 ** maxPower - totalParticipantNum >=
    totalParticipantNum - 2 ** minPower
    ? Math.floor(2 ** (minPower - 1)) +
        (totalParticipantNum - 2 ** minPower) +
        calculateTotal(2 ** (minPower - 2))
    : totalParticipantNum - 2 ** minPower + calculateTotal(2 ** (minPower - 1));
};

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
  let remainSeedPlayesNum = seedPlayerNum;
  const sortedMatches: Match[] = new Array(totalMatchNum);
  let front = 0;
  let back = totalMatchNum - 1;
  let aaaaaa = 0;

  while (remainMatchNum > 0) {
    if (!remainSeedPlayesNum) {
      sortedMatches[front++] = matches[aaaaaa++];
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
        aaaaaa += 2;
        remainMatchNum -= 2;
        remainSeedPlayesNum--;

        if (!remainSeedPlayesNum) {
          break;
        }
      }
    }
  }

  return sortedMatches;
};

export const createBracket = (
  totalParticipantNum: number,
  participantList?: string[],
  needToShuffleParticipants?: boolean
) => {
  const maxPower = Math.ceil(Math.log2(totalParticipantNum));
  const minPower = maxPower - 1;
  const seedPlayerNum = calculateSeedPlayer(
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
    let firstRoundArray = [];
    if (totalParticipantNum % 2 == 0) {
      const leftArrayNum = totalParticipantNum / 2;
      const leftSeedPlayerNum = seedPlayerNum / 2;
      const leftArray = createFirstRoundArray(leftArrayNum, leftSeedPlayerNum);
      firstRoundArray = [...leftArray, ...leftArray.reverse()];
    } else {
      const leftArrayNum =
        totalParticipantNum % 4 === 1
          ? Math.ceil(totalParticipantNum / 2)
          : Math.floor(totalParticipantNum / 2);
      const rightArrayNum = totalParticipantNum - leftArrayNum;
      const leftSeedPlayerNum =
        totalParticipantNum % 4 === 1
          ? Math.ceil(seedPlayerNum / 2)
          : Math.floor(seedPlayerNum / 2);
      const rightSeedPlayerNum = seedPlayerNum - leftSeedPlayerNum;
      const leftArray = createFirstRoundArray(
        leftArrayNum,
        leftSeedPlayerNum >= rightSeedPlayerNum
          ? leftSeedPlayerNum
          : rightSeedPlayerNum
      );
      const rightArray = createFirstRoundArray(
        rightArrayNum,
        leftSeedPlayerNum < rightSeedPlayerNum
          ? leftSeedPlayerNum
          : rightSeedPlayerNum
      );
      firstRoundArray = [...leftArray, ...rightArray];
    }

    matches = firstRoundArray.map((value) => {
      if ("player1" in value && "player2" in value) {
        if (
          !("currentRound" in value) &&
          isPowerOfTwo(
            (totalParticipantNum - seedPlayerNum * 3) / 2 + seedPlayerNum
          )
        ) {
          return { ...value, nextRound: undefined };
        }

        remainRoundNum--;
        return { ...value, currentRound: round++ };
      } else {
        return { ...value };
      }
    });
  }

  const used = new Set();
  let nextRound = round;

  const newParticipantList: Participant[] = participantList
    ? (needToShuffleParticipants
        ? shuffleArray<string>(participantList)
        : participantList
      ).map((value, index) => {
        return {
          id: index,
          name: value,
        };
      })
    : [];

  while (matches.filter((value) => !value.nextRound).length > 0) {
    for (let i = 0; i < matches.length; i++) {
      if (
        "player1" in matches[i] &&
        "player2" in matches[i] &&
        !matches[i].currentRound
      ) {
        matches[i].nextRound = nextRound++;
      } else {
        matches[i] = { ...matches[i], nextRound };
        if (
          matches.filter((value) => value.nextRound === nextRound).length === 2
        ) {
          nextRound++;
        }
      }

      if (newParticipantList) {
        if ("player1" in matches[i]) {
          const targetPlayer = newParticipantList.find(
            ({ id }) => !used.has(id)
          );
          matches[i].player1 = { ...matches[i].player1, ...targetPlayer };
          used.add(targetPlayer?.id);
        }

        if ("player2" in matches[i]) {
          const targetPlayer = newParticipantList.find(
            ({ id }) => !used.has(id)
          );
          matches[i].player2 = { ...matches[i].player2, ...targetPlayer };
          used.add(targetPlayer?.id);
        }
      }
    }
  }

  const result = new Map<number, Match[]>();
  let matchId = 0;
  result.set(matchId++, matches);

  while (remainRoundNum > 0) {
    const temp: Match[] = [];
    const tempNum = remainRoundNum;
    const sss = 2 ** Math.trunc(Math.log2(tempNum));
    let shouldContinue = false;

    for (let i = tempNum; i >= sss; i--) {
      const dsgsdgsdg: Match = { currentRound: round };
      const prevRoundElement = Array.from(result.values())
        .pop()
        ?.find((value) => value.nextRound === round && !value.currentRound);
      if (prevRoundElement) {
        dsgsdgsdg.player1 = omitResult(prevRoundElement.player1!);
        dsgsdgsdg.player2 = omitResult(prevRoundElement.player2!);
      }
      temp.push(dsgsdgsdg);
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

    if (temp.length > 1) {
      for (let i = 0; i < temp.length; i += 2) {
        temp[i] = { ...temp[i], nextRound };
        temp[i + 1] = { ...temp[i + 1], nextRound };
        nextRound++;
      }
    }

    result.set(matchId++, temp);
  }

  return result;
};
