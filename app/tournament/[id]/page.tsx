"use client";

import { useParams } from "next/navigation";

const TournamentDetail = () => {
  const params = useParams();

  return (
    <>
      <span>{params.id}</span>
    </>
  );
};

export default TournamentDetail;
