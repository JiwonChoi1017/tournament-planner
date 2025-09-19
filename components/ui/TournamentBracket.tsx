import { MATCH_RESULT } from "@/constants/commonConstant";
import { Match } from "@/types/common";

type Props = {
  matches: Match[];
};

const TournamentBracket = ({ matches }: Props) => {
  return (
    <div>
      {matches.map(({ round, player1, player2 }) => (
        <div key={round}>
          {player1 && (
            <div>
              <input
                type="radio"
                name={`result_${round}`}
                value={player1.id}
                defaultChecked={player1.result === MATCH_RESULT.WIN}
              />
              <label>{`${player1.name}`}</label>
            </div>
          )}
          {player2 && (
            <div>
              <input
                type="radio"
                name={`result_${round}`}
                value={player2.id}
                defaultChecked={player2.result === MATCH_RESULT.WIN}
              />
              <label>{`${player2.name}`}</label>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TournamentBracket;
