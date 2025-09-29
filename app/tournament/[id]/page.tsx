"use client";

import TournamentBracket from "@/components/ui/TournamentBracket";
import { useParams } from "next/navigation";

export default function TournamentDetail() {
  const params = useParams();

  return (
    <>
      <span>{params.id}</span>
      <TournamentBracket matches={undefined} />
    </>
  );
}
