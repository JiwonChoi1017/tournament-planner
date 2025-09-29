export const PAGES_URL = {
  TOP: "/",
  LOGIN: "/login",
  MYPAGE: "/mypage",
  TOURNAMENT_INPUT: "/tournament/input",
} as const;

export const AUTH_PROVIDER = {
  GOOGLE: "google",
  FACEBOOK: "facebook",
  TWITTER: "twitter",
} as const;

export const MATCH_RESULT = {
  WIN: "win",
  LOSE: "lose",
  BYE: "bye",
} as const;
