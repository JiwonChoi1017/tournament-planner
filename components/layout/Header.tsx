"use client";

import Link from "next/link";
import { PAGES_URL } from "@/constants/commonConstant";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { isLogin, user, loading, signOut } = useAuth();
  const router = useRouter();

  const onClickLogoutButtonHandler = async () => {
    // アラートを挟むように
    await signOut();
    router.push(PAGES_URL.TOP);
  };

  useEffect(() => {
    if (!isLogin && !localStorage.getItem("guest_id")) {
      // ゲストかつ初回アクセスの場合、ゲストidを生成してlocalStorageに保存する
      localStorage.setItem("guest_id", crypto.randomUUID());
    }
  }, [isLogin]);

  return (
    <header>
      <Link href={PAGES_URL.TOP}>ああああ</Link>
      <span>{user?.name}</span>
      {isLogin ? (
        <span onClick={onClickLogoutButtonHandler}>ログアウト</span>
      ) : (
        <Link href={PAGES_URL.LOGIN}>ログイン</Link>
      )}
    </header>
  );
};

export default Header;
