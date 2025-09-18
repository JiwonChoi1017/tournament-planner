const TournamentForm = () => {
  // 追加と修正のロジックを綺麗に切り分けられるか
  const submitHandler = async (formData: FormData) => {};

  return (
    <form action={submitHandler}>
      <button type="submit">保存</button>
    </form>
  );
};

export default TournamentForm;
