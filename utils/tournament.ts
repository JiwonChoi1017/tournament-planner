import { Match, Player } from "@/types/common";

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

export const createMatch1 = (players: Player[]): Match[] => {
  let round = 1;
  const matches: Match[] = [];

  for (let i = 0; i < players.length; i += 2) {
    if (i + 1 < players.length) {
      matches.push({
        round: round++,
        player1: players[i],
        player2: players[i + 1],
      });
    } else {
      // 余りが出た場合
      matches.push({
        round: round++,
        player1: { ...players[i], result: MATCH_RESULT.WIN },
      });
    }
  }

  return matches;
};

export const createMatch2 = (players: Player[]): Match[] => {
  const used = new Set();
  const matches = [];
  let round = 1;
  const pairLength =
    players.length % 3 === 0
      ? Math.floor(players.length / 3)
      : Math.floor(players.length / 3) + 1;
  const seedPlayerLength = players.length - pairLength * 2;

  for (let i = 0; i < seedPlayerLength; i++) {
    const player = players.find((p) => p.id === i * 3);
    if (!player) continue;

    matches.push({
      round: round++,
      player1: {
        ...player,
        result: MATCH_RESULT.WIN,
      },
    });
    used.add(player.id);
  }

  const remainedPlayers = players.filter(({ id }) => !used.has(id));

  for (let i = 0; i < remainedPlayers.length; i += 2) {
    matches.push({
      round: round++,
      player1: remainedPlayers[i],
      player2: remainedPlayers[i + 1],
    });
  }

  return [...matches].sort((a, b) => (a.player1.id > b.player1.id ? 1 : -1));
};
