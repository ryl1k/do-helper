"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithGoogle, signInWithMagicLink, useSession } from "@/lib/auth";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const { t } = useT();
  const router = useRouter();
  const { session, loading } = useSession();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && session) router.replace("/profile");
  }, [loading, session, router]);

  async function submitMagic(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null);
    try {
      const redirect = `${window.location.origin}/profile`;
      await signInWithMagicLink(email.trim(), redirect);
      setSent(true);
    } catch (e: any) {
      setErr(t("login.error") + (e?.message ?? String(e)));
    } finally {
      setBusy(false);
    }
  }

  async function clickGoogle() {
    setErr(null);
    try {
      const redirect = `${window.location.origin}/profile`;
      await signInWithGoogle(redirect);
    } catch (e: any) {
      setErr(t("login.error") + (e?.message ?? String(e)));
    }
  }

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("login.title")}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("login.subtitle")}</p>
      </header>

      {sent ? (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 px-4 py-3 text-sm">
          {t("login.sent")}
        </div>
      ) : (
        <div className="space-y-4">
          <button
            type="button"
            onClick={clickGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-sky-500 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            <GoogleIcon />
            <span>{t("login.google")}</span>
          </button>

          <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-500">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
            <span className="uppercase tracking-wider">{t("login.or")}</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          </div>

          <form onSubmit={submitMagic} className="space-y-3">
            <label className="block">
              <span className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t("login.email")}</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-base focus:border-blue-500 dark:focus:border-sky-500"
                placeholder="you@example.com"
              />
            </label>
            <button
              type="submit"
              disabled={busy || !email.trim()}
              className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 disabled:opacity-50 text-white dark:text-slate-950 font-semibold transition-colors"
            >
              {busy ? "…" : t("login.send")}
            </button>
          </form>

          {err && <div className="text-sm text-red-500">{err}</div>}
        </div>
      )}
    </main>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
      <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
      <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571.001-.001.002-.001.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
    </svg>
  );
}
