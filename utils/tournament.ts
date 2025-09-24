import { Match, Player } from "@/types/common";
import { isPowerOfTwo, omitResult, sumRounds } from "./common";

import { MATCH_RESULT } from "@/constants/commonConstant";

export const shufflePlayers = (unshuffledPlayers: string[]): string[] => {
  const shuffledPlayers = [...unshuffledPlayers];
  for (let i = shuffledPlayers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledPlayers[i], shuffledPlayers[j]] = [
      shuffledPlayers[j],
      shuffledPlayers[i],
    ];
  }

  return shuffledPlayers;
};

const calculateTotalRoundNum = (
  maxPower: number,
  minPower: number,
  totalPlayerNum: number
) => {
  return 2 ** maxPower - totalPlayerNum >= totalPlayerNum - 2 ** minPower
    ? Math.floor(2 ** (minPower - 1)) +
        (totalPlayerNum - 2 ** minPower) +
        sumRounds(2 ** (minPower - 2))
    : totalPlayerNum - 2 ** minPower + sumRounds(2 ** (minPower - 1));
};

export const createBracket = (players: Player[]) => {
  const totalPlayerNum = players.length;
  const maxPower = Math.ceil(Math.log2(totalPlayerNum));
  const minPower = maxPower - 1;
  const seedPlayerNum =
    2 ** maxPower - totalPlayerNum > totalPlayerNum - 2 ** minPower
      ? totalPlayerNum - 2 ** minPower
      : 2 ** maxPower - totalPlayerNum;
  const totalRoundNum = calculateTotalRoundNum(
    maxPower,
    minPower,
    totalPlayerNum
  );
  console.log(players);

  let round = 1;
  let remainRoundNum = totalRoundNum;
  const used = new Set();
  const matches: Match[] = [];

  for (let i = 0; i < seedPlayerNum; i++) {
    if (i % 2 === 0) {
      matches.push({
        player1: {
          ...players[i],
          result: MATCH_RESULT.WIN,
        },
      });
    } else {
      matches.push({
        player2: {
          ...players[i],
          result: MATCH_RESULT.WIN,
        },
      });
    }
    used.add(players[i].id);
  }

  const remainedPlayers = players.filter(({ id }) => !used.has(id));
  while (!isPowerOfTwo(remainRoundNum + 1)) {
    for (let i = 0; i < remainedPlayers.length; i += 2) {
      matches.push({
        currentRound: round,
        player1: remainedPlayers[i],
        player2: remainedPlayers[i + 1],
      });
      used.add(remainedPlayers[i].id);
      used.add(remainedPlayers[i + 1].id);

      round++;
      remainRoundNum--;

      // remainRoundNum + 1が2の冪になったら即座にループを抜ける
      if (isPowerOfTwo(remainRoundNum + 1)) {
        break;
      }
    }
  }

  const aaadddd = remainedPlayers.filter(({ id }) => !used.has(id));
  if (aaadddd.length) {
    for (let i = 0; i < aaadddd.length; i += 2) {
      matches.push({
        player1: aaadddd[i],
        player2: aaadddd[i + 1],
      });
    }
  }

  // matches配列を交互にソート
  const winWithoutPlayer2 = matches.filter(
    (match) => !match.player1 || !match.player2
  );
  const hasPlayer2NoResult = matches.filter(
    (match) => match.player1 && match.player2 && match.currentRound
  );
  const bbbbb = matches.filter(
    (match) => match.player1 && match.player2 && !match.currentRound
  );

  const sortedMatches: Match[] = [];

  for (let i = 0; i < matches.length; i++) {
    if (i % 2 === 0) {
      if (i < winWithoutPlayer2.length) {
        sortedMatches.push(winWithoutPlayer2[i]);
      }
      if (i < hasPlayer2NoResult.length) {
        sortedMatches.push(hasPlayer2NoResult[i]);
      }
      if (i < bbbbb.length) {
        sortedMatches.push(bbbbb[i]);
      }
    } else {
      if (i < bbbbb.length) {
        sortedMatches.push(bbbbb[i]);
      }
      if (i < hasPlayer2NoResult.length) {
        sortedMatches.push(hasPlayer2NoResult[i]);
      }
      if (i < winWithoutPlayer2.length) {
        sortedMatches.push(winWithoutPlayer2[i]);
      }
    }
  }

  let nextRound = round;

  while (sortedMatches.filter((value) => !value.nextRound).length > 0) {
    for (let i = 0; i < sortedMatches.length; i++) {
      if (
        sortedMatches[i].player1 &&
        sortedMatches[i].player2 &&
        !sortedMatches[i].currentRound
      ) {
        sortedMatches[i].nextRound = nextRound++;
      } else {
        sortedMatches[i].nextRound = nextRound;
        if (
          sortedMatches.filter((value) => value.nextRound === nextRound)
            .length === 2
        ) {
          nextRound++;
        }
      }
    }
  }

  const result = new Map<number, Match[]>();
  let matchId = 0;
  result.set(matchId++, sortedMatches);

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
