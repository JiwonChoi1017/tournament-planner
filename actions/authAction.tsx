"use server";

import { createClient } from "@/utils/supabase/server";

export const signInWithEmailAction = async (formData: FormData) => {
  const email = (formData.get("email") as string) || "";
  if (!email) {
    //
    return;
  }
  // メールアドレスが正しくない場合

  // メールが送信されたことがわかるように
  // フォームの初期化
  // 自前で実装した方がいいかも？
  // テーブルに情報を入れる

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });
};
