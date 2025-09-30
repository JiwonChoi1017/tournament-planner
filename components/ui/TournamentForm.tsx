"use client";

import { ParticipantOptions } from "@/types/common";
import { useState } from "react";

/** Props */
type Props = {
  createTournamentBracket: (participantOptions: ParticipantOptions) => void;
};

const TournamentForm = ({ createTournamentBracket }: Props) => {
  const [participants, setParticipants] = useState<string>("");
  const [allocation, setAllocation] = useState<string>("1");

  const changeParticipantsHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setParticipants(event.target.value);
  };

  const changeAllocationHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAllocation(event.target.value);
  };

  const onClickCreateTournamentBracketButton = () => {
    const participantList = participants.trim().split("\n") || [];
    // 人数制限
    if (participantList.length < 2 || participantList.length > 64) {
      // 弾くように
      return;
    }
    // どっかのタイミングでBracket側の参加者リストを初期化しないとダメ
    createTournamentBracket({
      participantList,
      needToShuffleParticipants: allocation === "0",
    });
  };
  // playersバリデーション追加

  return (
    <form>
      {/* タブで切り替えられるようにしたい */}
      <label>
        大会名
        <input type="text" name="name" />
      </label>
      <label>
        会場
        <input type="text" name="placement" />
      </label>
      <label>
        開催日
        <input type="date" />
      </label>
      <label>
        終了日
        <input type="date" />
      </label>
      <label>
        概要
        <textarea name="description" />
      </label>
      <div>
        <label>
          参加者数
          <input type="tel" name="totalParticipantNum" />
        </label>
        <label>
          参加者リスト
          <textarea
            value={participants}
            name="participants"
            onChange={changeParticipantsHandler}
          />
        </label>
        <label>
          3位決定戦
          <div>
            <input
              type="radio"
              name="thirdPriceMatch"
              value="1"
              defaultChecked
            />
            <label>表示</label>
            <input type="radio" name="thirdPriceMatch" value="0" />
            <label>非表示</label>
          </div>
        </label>
        <label>
          スコア
          <div>
            <input type="radio" name="score" value="1" defaultChecked />
            <label>表示</label>
            <input type="radio" name="score" value="0" />
            <label>非表示</label>
          </div>
        </label>
        <label>
          配置方法
          <div>
            <input
              type="radio"
              name="allocation"
              value="1"
              defaultChecked
              onChange={changeAllocationHandler}
            />
            <label>入力順</label>
            <input
              type="radio"
              name="allocation"
              value="0"
              onChange={changeAllocationHandler}
            />
            <label>シャッフル</label>
          </div>
        </label>
        <button type="button" onClick={onClickCreateTournamentBracketButton}>
          トーナメント表を生成
        </button>
      </div>
      <label></label>
      {/* <button type="submit">保存</button> */}
    </form>
  );
};

export default TournamentForm;
