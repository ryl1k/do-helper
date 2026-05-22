"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ALL_CATEGORIES, categoryDotClass, effectiveCategories, shortLabel } from "@/lib/categories";
import { loadQuestions, type Question } from "@/lib/questions";
import { useT } from "@/lib/i18n";
import { useSession } from "@/lib/auth";

export default function HomePage() {
  const { t } = useT();
  const { session, loading: sessionLoading } = useSession();
  const [qs, setQs] = useState<Question[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions().then(setQs).catch((e) => setErr(String(e?.message ?? e)));
  }, []);

  const counts: Record<string, number> = {};
  for (const q of qs ?? []) {
    for (const c of effectiveCategories(q.categories)) {
      counts[c] = (counts[c] ?? 0) + 1;
    }
  }

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      <section className="space-y-3 max-w-2xl">
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          {t("home.title.1")}{" "}
          <span className="text-blue-600 dark:text-sky-400">{t("home.title.2")}</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          {t("home.subtitle")}
        </p>
        {err && <div className="text-sm text-red-500">{err}</div>}
      </section>

      <section className="grid sm:grid-cols-2 gap-4">
        <Link
          href="/quiz"
          className="group block rounded-2xl overflow-hidden border border-blue-200 dark:border-sky-500/30 bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 p-6 sm:p-8 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center size-9 rounded-lg bg-white/15 dark:bg-slate-950/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><polygon points="6 4 20 12 6 20 6 4" /></svg>
            </span>
            <div className="text-lg font-semibold">{t("home.cta.quiz.title")}</div>
          </div>
          <div className="text-sm opacity-90">{t("home.cta.quiz.body")}</div>
          <div className="mt-4 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            {t("home.cta.start")} <span aria-hidden>→</span>
          </div>
        </Link>

        <Link
          href="/search"
          className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-blue-300 dark:hover:border-sky-700"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center size-9 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-sky-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </span>
            <div className="text-lg font-semibold">{t("home.cta.search.title")}</div>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{t("home.cta.search.body")}</div>
          <div className="mt-4 text-sm font-medium text-blue-600 dark:text-sky-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            {t("home.cta.open")} <span aria-hidden>→</span>
          </div>
        </Link>
      </section>

      {!sessionLoading && !session && (
        <section className="rounded-2xl border border-blue-200 dark:border-sky-500/30 bg-blue-50 dark:bg-sky-500/10 p-5 sm:p-6 flex items-start gap-4">
          <span className="inline-flex items-center justify-center size-10 rounded-xl bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 shrink-0">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21v-1a8 8 0 0 1 16 0v1" /></svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-900 dark:text-slate-100">{t("home.signIn.title")}</div>
            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{t("home.signIn.body")}</p>
          </div>
          <Link
            href="/login"
            className="shrink-0 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 text-sm font-semibold transition-colors"
          >
            {t("home.signIn.cta")}
          </Link>
        </section>
      )}

      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
            {t("home.topics")}
          </h2>
          <Link href="/search" className="text-xs text-blue-600 dark:text-sky-400 hover:underline">
            {t("home.browseAll")}
          </Link>
        </div>
        <ul className="grid sm:grid-cols-2 gap-1.5">
          {ALL_CATEGORIES.map((c) => (
            <li key={c}>
              <Link
                href={`/search?cat=${encodeURIComponent(c)}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
              >
                <span className={`inline-block size-2.5 rounded-full ${categoryDotClass(c)}`} />
                <span className="flex-1 truncate text-sm group-hover:text-blue-700 dark:group-hover:text-sky-300">
                  {shortLabel(c)}
                </span>
                <span className="tabular-nums text-xs text-slate-500 dark:text-slate-400">
                  {counts[c] ?? 0}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
