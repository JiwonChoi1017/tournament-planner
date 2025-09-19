"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

type AuthContextType = {
  isLogin: boolean;
  user: (User & { name: string }) | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLogin: false,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [user, setUser] = useState<(User & { name: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          // エラーハンドリング
          return;
        }

        if (isMounted) {
          setIsLogin(!!data.session);
          setUser(
            data.session?.user ? { ...data.session?.user, name: "aaa" } : null
          );
          setLoading(false);
        }
      } catch (error) {
        // エラーハンドリング
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // 状態変化の監視
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (isMounted) {
          setIsLogin(!!session);
          // 名前どうするか迷ってるとこ
          setUser(session?.user ? { ...session?.user, name: "aaa" } : null);
        }
      }
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  // エラーをリターンするように
  const signOut = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setIsLogin(false);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isLogin, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
