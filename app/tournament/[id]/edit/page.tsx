"use client";

import TournamentBracket from "@/components/ui/TournamentBracket";
import TournamentForm from "@/components/ui/TournamentForm";

export default function TournamentEdit() {
  const submitHandler = (formData: FormData) => {
    return;
  };

  return (
    <>
      <span>Tournament Edit</span>
      <TournamentForm submitHandler={submitHandler} />
      <TournamentBracket matches={[]} />
    </>
  );
}
