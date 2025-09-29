"use client";

import { Matches, TournamentBracketElement } from "@/types/common";

import TournamentBracket from "@/components/ui/TournamentBracket";
import TournamentForm from "@/components/ui/TournamentForm";
import { createBracket } from "@/utils/tournament";
import { useState } from "react";

export default function TournamentInput() {
  const [matches, setMatches] = useState<Matches | undefined>();

  // 保存と処理を切り分けたい
  const createTournamentBracket = async ({
    participants,
    needToShuffleParticipants,
  }: TournamentBracketElement) => {
    const participantList = participants.split("\n") || [];
    if (!participantList) {
      return;
    }
    // 人数制限

    const generatedMatches = createBracket(
      participantList.length,
      participantList,
      needToShuffleParticipants
    );
    console.log(generatedMatches);
    setMatches(generatedMatches);
    // トーナメント表のidを生成し、dbに格納
  };

  return (
    <>
      <span>Tournament Input</span>
      <TournamentForm createTournamentBracket={createTournamentBracket} />
      <TournamentBracket matches={matches} />
    </>
  );
}
