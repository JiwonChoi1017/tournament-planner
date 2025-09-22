import { MATCH_RESULT } from "@/constants/commonConstant";
import { Matches } from "@/types/common";

type Props = {
  matches: Matches[];
};

const TournamentBracket = ({ matches }: Props) => {
  return (
    <div>
      {matches.map((value) =>
        value.aaaaa.map(({ id, currentRound, player1, player2 }) => (
          <div key={`${value.id}_${id}`} style={{ marginBottom: "10px" }}>
            {player1 ? (
              <div>
                <input
                  type="radio"
                  name={`result_${id}`}
                  value={player1.id}
                  defaultChecked={player1.result === MATCH_RESULT.WIN}
                />
                <label>
                  <input type="text" defaultValue={`${player1.name}`} />
                </label>
              </div>
            ) : (
              <div>
                <input type="radio" name={`result_${id}`} />
                <label>
                  <input type="text" />
                </label>
              </div>
            )}
            {player2 ? (
              <div>
                <input
                  type="radio"
                  name={`result_${id}`}
                  value={player2.id}
                  defaultChecked={player2.result === MATCH_RESULT.WIN}
                />
                <label>
                  <input type="text" defaultValue={`${player2.name}`} />
                </label>
              </div>
            ) : (
              <div>
                <input type="radio" name={`result_${id}`} />
                <label>
                  <input type="text" />
                </label>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TournamentBracket;
