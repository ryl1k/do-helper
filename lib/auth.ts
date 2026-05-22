"use client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabase } from "./supabase-client";

export interface Profile {
  id: string;
  display_name: string | null;
  locale: string;
}

const ANON_KEY = "anonVoterId";

export function getOrCreateAnonId(): string {
  if (typeof window === "undefined") return "anon_ssr";
  let v = window.localStorage.getItem(ANON_KEY);
  if (!v) {
    const r = (typeof crypto !== "undefined" && "randomUUID" in crypto)
      ? crypto.randomUUID().replace(/-/g, "")
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
    v = `anon_${r.slice(0, 16)}`;
    window.localStorage.setItem(ANON_KEY, v);
  }
  return v;
}

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabase();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  return { session, loading };
}

export function useProfile() {
  const { session, loading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    const supabase = getSupabase();
    let mounted = true;
    supabase
      .from("profiles")
      .select("id, display_name, locale")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        setProfile((data as Profile | null) ?? null);
        setLoading(false);
      });
    return () => { mounted = false; };
  }, [session, sessionLoading]);

  return { session, profile, loading };
}

export async function signOut() {
  await getSupabase().auth.signOut();
}

export async function signInWithMagicLink(email: string, redirectTo: string) {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: redirectTo },
  });
  if (error) throw error;
}

export async function signInWithGoogle(redirectTo: string) {
  const supabase = getSupabase();
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}
