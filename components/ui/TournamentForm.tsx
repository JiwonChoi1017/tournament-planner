"use client";

type Props = {
  submitHandler: (formData: FormData) => void;
};

const TournamentForm = ({ submitHandler }: Props) => {
  // playersバリデーション追加

  return (
    <form action={submitHandler}>
      <textarea name="players"></textarea>
      <button type="submit">保存</button>
    </form>
  );
};

export default TournamentForm;
