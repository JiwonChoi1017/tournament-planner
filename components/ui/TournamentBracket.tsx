import { MATCH_RESULT } from "@/constants/commonConstant";
import { Matches } from "@/types/common";
import React from "react";

type Props = {
  matches: Matches | undefined;
};

export default function TournamentBracket({ matches }: Props) {
  return (
    <div>
      {matches ? (
        <>
          {Array.from(matches.entries()).map(([id, matchList]) => (
            <div key={id}>
              {matchList.map(({ currentRound, player1, player2 }, idx) => (
                <div key={`${id}_${idx}`} style={{ marginBottom: "10px" }}>
                  {(player1 || id > 0) && (
                    <div>
                      <input
                        type="radio"
                        name={`result_${id}_${idx}`}
                        value={player1?.id}
                        defaultChecked={player1?.result === MATCH_RESULT.WIN}
                      />
                      <label>
                        <input
                          type="text"
                          defaultValue={`${player1?.name ?? ""}`}
                        />
                      </label>
                    </div>
                  )}
                  {(player2 || id > 0) && (
                    <div>
                      <input
                        type="radio"
                        name={`result_${id}_${idx}`}
                        value={player2?.id}
                        defaultChecked={player2?.result === MATCH_RESULT.WIN}
                      />
                      <label>
                        <input
                          type="text"
                          defaultValue={`${player2?.name ?? ""}`}
                        />
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}
