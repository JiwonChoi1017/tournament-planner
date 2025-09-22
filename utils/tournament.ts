import { Match, Matches, Player } from "@/types/common";

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

const sumRounds = (num: number): number => {
  if (num === 0) return 0;
  return num + sumRounds(Math.floor(num / 2));
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
  console.log(
    totalPlayerNum,
    calculateTotalRoundNum(maxPower, minPower, totalPlayerNum)
  );

  let id = 1;
  let round = 1;
  const used = new Set();
  const matches: Match[] = [];

  for (let i = 0; i < seedPlayerNum; i++) {
    const player = players.find((p) => p.id === i * 3);
    if (!player) continue;

    matches.push({
      id: id++,
      player1: {
        ...player,
        result: MATCH_RESULT.WIN,
      },
    });
    used.add(player.id);
  }

  const remainedPlayers = players.filter(({ id }) => !used.has(id));

  // ロジックの改修がいる（2回戦から必ず偶数になるように）
  for (let i = 0; i < remainedPlayers.length; i += 2) {
    matches.push({
      id: id++,
      currentRound: round++,
      player1: remainedPlayers[i],
      player2: remainedPlayers[i + 1],
    });
  }

  const sortedMatches = [...matches].sort((a, b) =>
    (a.player1 as Player).id > (b.player1 as Player).id ? 1 : -1
  );

  let nextRound = round;

  for (let i = 0; i < sortedMatches.length; i += 2) {
    if (i + 1 < sortedMatches.length) {
      sortedMatches[i].nextRound = nextRound;
      sortedMatches[i + 1].nextRound = nextRound;
      nextRound++;
    }
  }

  const result: Matches[] = [];
  let matchId = 1;
  result.push({ id: matchId++, aaaaa: sortedMatches });

  while ((result.at(-1)?.aaaaa ?? []).length > 1) {
    const temp = result.at(-1)?.aaaaa ?? [];
    const temp2: Match[] = [];
    for (let i = 0; i < temp.length / 2; i++) {
      if (temp.length === 2) {
        temp2.push({ id: id++, currentRound: round++ });
      } else {
        temp2.push({ id: id++, currentRound: round++, nextRound: nextRound++ });
      }
    }
    result.push({ id: matchId++, aaaaa: temp2 });
  }

  return result;
};
