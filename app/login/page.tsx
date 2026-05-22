"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithMagicLink, useSession } from "@/lib/auth";
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

  async function submit(e: React.FormEvent) {
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

  return (
    <main className="max-w-md mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t("login.title")}</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">{t("login.subtitle")}</p>
      </header>

      {sent ? (
        <div className="rounded-xl border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 px-4 py-3 text-sm">
          {t("login.sent")}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">{t("login.email")}</span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-base focus:border-blue-500 dark:focus:border-sky-500"
              placeholder="you@example.com"
            />
          </label>
          {err && <div className="text-sm text-red-500">{err}</div>}
          <button
            type="submit"
            disabled={busy || !email.trim()}
            className="w-full px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 disabled:opacity-50 text-white dark:text-slate-950 font-semibold transition-colors"
          >
            {busy ? "…" : t("login.send")}
          </button>
        </form>
      )}
    </main>
  );
}
