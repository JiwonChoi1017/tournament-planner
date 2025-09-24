import { AUTH_PROVIDER, MATCH_RESULT } from "@/constants/commonConstant";

type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];

type MatchResult = (typeof MATCH_RESULT)[keyof typeof MATCH_RESULT];

type Player = {
  id: number;
  entryNumber?: number;
  name: string;
  nameKana?: string;
  hometown?: string;
};

type Match = {
  currentRound?: number;
  nextRound?: number;
  player1?: Player & { score?: number; color?: string; result?: MatchResult };
  player2?: Player & { score?: number; color?: string; result?: MatchResult };
};

type Matches = Map<number, Match[]>;
