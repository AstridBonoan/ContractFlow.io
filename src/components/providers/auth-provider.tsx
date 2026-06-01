"use client";

import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import {
  demoSignIn,
  demoSignOut,
  demoSignUp,
  getSession,
  setSession,
  type AuthUser,
} from "@/lib/auth-store";
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    fullName: string;
    companyName?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function mapSupabaseUser(user: User, metadata?: Record<string, unknown>): AuthUser {
  return {
    id: user.id,
    email: user.email ?? "",
    fullName: (metadata?.full_name as string) || user.user_metadata?.full_name || "Contractor",
    companyName: (metadata?.company_name as string) || user.user_metadata?.company_name,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const syncUser = useCallback((next: AuthUser | null) => {
    setUser(next);
    if (!isSupabaseConfigured()) {
      setSession(next);
    }
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const init = async () => {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient()!;
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          syncUser(mapSupabaseUser(data.session.user));
        }
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
          syncUser(session?.user ? mapSupabaseUser(session.user) : null);
        });
        unsubscribe = () => listener.subscription.unsubscribe();
      } else {
        syncUser(getSession());
      }
      setLoading(false);
    };

    void init();
    return () => unsubscribe?.();
  }, [syncUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient()!;
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw new Error(error.message);
      if (data.user) syncUser(mapSupabaseUser(data.user));
      return;
    }
    const demoUser = demoSignIn(email, password);
    syncUser(demoUser);
  }, [syncUser]);

  const signUp = useCallback(
    async (input: { email: string; password: string; fullName: string; companyName?: string }) => {
      if (isSupabaseConfigured()) {
        const supabase = getSupabaseClient()!;
        const { data, error } = await supabase.auth.signUp({
          email: input.email,
          password: input.password,
          options: {
            data: {
              full_name: input.fullName,
              company_name: input.companyName,
              role: "contractor",
            },
          },
        });
        if (error) throw new Error(error.message);

        if (data.user) {
          await supabase.from("users").upsert({
            id: data.user.id,
            email: input.email,
            full_name: input.fullName,
            company_name: input.companyName ?? null,
            role: "contractor",
          });
          if (data.session) {
            syncUser(mapSupabaseUser(data.user));
          } else {
            throw new Error(
              "Account created. Check your email to confirm, then sign in."
            );
          }
        }
        return;
      }
      const demoUser = demoSignUp(input);
      syncUser(demoUser);
    },
    [syncUser]
  );

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured()) {
      const supabase = getSupabaseClient()!;
      await supabase.auth.signOut();
    } else {
      demoSignOut();
    }
    syncUser(null);
  }, [syncUser]);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
