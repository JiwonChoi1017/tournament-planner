"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { PAGES_URL } from "@/constants/common";
import { createClient } from "@/utils/supabase/client";
import { signOutAction } from "@/actions/authAction";
import { useRouter } from "next/navigation";

interface User {
  isLogin: boolean;
  uuid: string;
  name: string;
}

const Header = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  const onClickLogoutHandler = async () => {
    // アラートを挟むように
    await signOutAction();
    setCurrentUser({
      isLogin: false,
      uuid: localStorage.getItem("guest_id") || "",
      name: "ゲスト",
    });
    router.push(`${process.env.NEXT_PUBLIC_APP_URL}${PAGES_URL.TOP}`);
  };

  const getCurrentUser = async () => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getSession();

    if (!data.session) {
      if (!localStorage.getItem("guest_id")) {
        // 初回アクセス時にゲストidを生成してlocalStorageに保存する
        localStorage.setItem("guest_id", crypto.randomUUID());
      }

      setCurrentUser({
        isLogin: false,
        uuid: localStorage.getItem("guest_id") || "",
        name: "ゲスト",
      });

      return;
    }

    // レスポンスからデータ取得して値を詰める
    setCurrentUser({
      isLogin: true,
      uuid: "aaa",
      name: "bbb",
    });
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <header>
      <span>{currentUser?.name}</span>
      {currentUser?.isLogin ? (
        <span onClick={onClickLogoutHandler}>ログアウト</span>
      ) : (
        <Link href={PAGES_URL.LOGIN}>ログイン</Link>
      )}
    </header>
  );
};

export default Header;
