"use client";

import { Match, Player } from "@/types/common";
import { createMatch1, createMatch2, shufflePlayers } from "@/utils/tournament";

import TournamentBracket from "@/components/ui/TournamentBracket";
import TournamentForm from "@/components/ui/TournamentForm";
import { useState } from "react";

export default function TournamentInput() {
  const [matches, setMatches] = useState<Match[]>([]);

  // 保存と処理を切り分けたい
  const submitHandler = async (formData: FormData) => {
    const players = (formData.get("players") as string)?.split("\n") || [];
    if (!players) {
      return;
    }
    // 人数制限

    // 入力順とシャッフルの判定が必要
    const shuffledPlayers: Player[] = shufflePlayers(players).map(
      (value, index) => {
        return {
          id: index,
          name: value,
        };
      }
    );

    console.log(shuffledPlayers);
    console.log(createMatch2(shuffledPlayers));
    setMatches(createMatch2(shuffledPlayers));
    // トーナメント表のidを生成し、dbに格納
  };

  return (
    <>
      <span>Tournament Input</span>
      <TournamentForm submitHandler={submitHandler} />
      <TournamentBracket matches={matches} />
    </>
  );
}
