"use client";

import TournamentBracket from "@/components/ui/TournamentBracket";
import { TournamentBracketElement } from "@/types/common";
import TournamentForm from "@/components/ui/TournamentForm";

export default function TournamentEdit() {
  const createTournamentBracket = (bracket: TournamentBracketElement) => {
    return;
  };

  return (
    <>
      <span>Tournament Edit</span>
      <TournamentForm createTournamentBracket={createTournamentBracket} />
      <TournamentBracket matches={undefined} />
    </>
  );
}
