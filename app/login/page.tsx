"use client";

import { AUTH_PROVIDER, PAGES_URL } from "@/constants/commonConstant";
import { useCallback, useEffect, useRef } from "react";

import { AuthProvider } from "@/types/common";
import { createClient } from "@/utils/supabase/client";
import { signInWithEmailAction } from "@/actions/authAction";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { isLogin, loading } = useAuth();
  const hasRedirected = useRef(false);

  const signInWithOAuth = async (authProvider: AuthProvider) => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: authProvider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });
  };

  const redirectToTop = useCallback(() => {
    if (!hasRedirected.current) {
      hasRedirected.current = true;
      try {
        // Next.js 15.5.3でのrouter.pushの問題を回避するため、window.locationを使用
        window.location.href = PAGES_URL.TOP;
      } catch (error) {
        // フォールバックとしてrouter.pushを使用
        router.push(PAGES_URL.TOP);
      }
    }
  }, [router]);

  useEffect(() => {
    if (!loading && isLogin && !hasRedirected.current) {
      // 読み込み済み、かつログイン済み、かつリダイレクト前の場合
      // 少し遅延させて、コンポーネントのマウントが完了してからトップ画面にリダイレクト
      const timeoutId = setTimeout(() => {
        redirectToTop();
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [loading, isLogin, redirectToTop]);

  return (
    <>
      {/* タブで切り替えられるように */}
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
