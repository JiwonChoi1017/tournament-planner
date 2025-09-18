"use client";

import TournamentBracket from "@/components/ui/TournamentBracket";
import { useParams } from "next/navigation";

const TournamentDetail = () => {
  const params = useParams();

  return (
    <>
      <span>{params.id}</span>
      <TournamentBracket />
    </>
  );
};

export default TournamentDetail;
