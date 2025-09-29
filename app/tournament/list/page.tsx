"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

type Tournament = {
  id: string;
  name: string;
  placement: string;
  start_date: Date;
  end_date: Date;
};

export default function TournamentList() {
  const [tournamentList, setTournamentList] = useState<Tournament[]>([]);

  useEffect(() => {
    const fetchTournamentList = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tournament")
        .select("id, name, placement, start_date, end_date")
        .range(0, 9);

      if (error) {
        console.error(error);
        return;
      }

      console.log("data:", data);
      setTournamentList(data ?? []);
    };

    fetchTournamentList();
  }, []);

  return (
    <div>
      {tournamentList.map((value) => (
        <div key={value.id}>
          <Link href={`/tournament/${value.id}`}>
            <span>{value.name}</span>
            <span>{value.placement}</span>
          </Link>
        </div>
      ))}
    </div>
  );
}
