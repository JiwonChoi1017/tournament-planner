"use client";

import { Matches, ParticipantOptions } from "@/types/common";

import TournamentBracket from "@/components/ui/TournamentBracket";
import TournamentForm from "@/components/ui/TournamentForm";
import { createTotalMatch } from "@/utils/tournament";
import { useState } from "react";

export default function TournamentInput() {
  const [matches, setMatches] = useState<Matches | undefined>();
  const [version, setVersion] = useState<number>(0);

  // 保存と処理を切り分けたい
  const createTournamentBracket = async ({
    participantList,
    needToShuffleParticipants,
  }: ParticipantOptions) => {
    const generatedMatches = createTotalMatch(
      participantList.length,
      participantList,
      needToShuffleParticipants
    );
    console.log(generatedMatches);
    setVersion((v) => v + 1);
    setMatches(generatedMatches);
    // トーナメント表のidを生成し、dbに格納
  };

  return (
    <>
      <span>Tournament Input</span>
      <TournamentForm createTournamentBracket={createTournamentBracket} />
      <TournamentBracket key={version} matches={matches} />
    </>
  );
}
