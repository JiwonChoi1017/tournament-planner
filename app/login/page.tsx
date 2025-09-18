"use client";

import { AUTH_PROVIDER } from "@/constants/common";
import { AuthProvider } from "@/types/common";
import { createClient } from "@/utils/supabase/client";
import { signInWithEmailAction } from "@/actions/authAction";
import { useEffect } from "react";

export default function LoginPage() {
  const signInWithOAuth = async (authProvider: AuthProvider) => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: authProvider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
  };

  useEffect(() => {
    // ログイン済みの場合はトップ画面にリダイレクト
  }, []);

  return (
    <>
      <div>
        <form action={signInWithEmailAction}>
          <input type="email" name="email" />
          <button type="submit">ログイン</button>
        </form>
      </div>
      <div>
        <button
          type="button"
          onClick={() => signInWithOAuth(AUTH_PROVIDER.GOOGLE)}
        >
          Google
        </button>
        <button
          type="button"
          onClick={() => signInWithOAuth(AUTH_PROVIDER.FACEBOOK)}
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={() => signInWithOAuth(AUTH_PROVIDER.TWITTER)}
        >
          X
        </button>
      </div>
    </>
  );
}
