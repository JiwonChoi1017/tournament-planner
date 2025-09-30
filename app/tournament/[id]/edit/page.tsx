"use client";

import { ParticipantOptions } from "@/types/common";
import TournamentBracket from "@/components/ui/TournamentBracket";
import TournamentForm from "@/components/ui/TournamentForm";

export default function TournamentEdit() {
  const createTournamentBracket = (bracket: ParticipantOptions) => {
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
