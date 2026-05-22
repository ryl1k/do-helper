"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CATEGORIES, categoryDotClass, shortLabel } from "@/lib/categories";
import { loadQuestions, type Question } from "@/lib/questions";

export default function HomePage() {
  const [qs, setQs] = useState<Question[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions().then(setQs).catch((e) => setErr(String(e?.message ?? e)));
  }, []);

  const counts: Record<string, number> = {};
  for (const q of qs ?? []) for (const c of q.categories) counts[c] = (counts[c] ?? 0) + 1;
  const uncategorized = (qs ?? []).filter((q) => q.categories.length === 0).length;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Hero */}
      <section className="space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 text-xs font-medium text-blue-700 dark:text-sky-300 bg-blue-50 dark:bg-sky-500/10 border border-blue-200 dark:border-sky-500/30 rounded-full px-3 py-1">
          <span className="inline-block size-1.5 rounded-full bg-blue-500 dark:bg-sky-400" />
          {qs ? `${qs.length} questions ready` : err ? "" : "Loading…"}
        </div>
        <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight">
          Дослідження{" "}
          <span className="text-blue-600 dark:text-sky-400">операцій</span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400">
          Pick a topic, take a quiz, see what you got wrong. A clean study tool for the OR exam bank.
        </p>
        {err && <div className="text-sm text-red-500">{err}</div>}
      </section>

      {/* Primary CTAs */}
      <section className="grid sm:grid-cols-2 gap-4">
        <Link href="/quiz" className="group block rounded-2xl overflow-hidden border border-blue-200 dark:border-sky-500/30 bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 p-6 sm:p-8 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center size-9 rounded-lg bg-white/15 dark:bg-slate-950/15">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden><polygon points="6 4 20 12 6 20 6 4" /></svg>
            </span>
            <div className="text-lg font-semibold">Take a quiz</div>
          </div>
          <div className="text-sm opacity-90">Pick topics, answer random questions, see your score and review mistakes.</div>
          <div className="mt-4 text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Start <span aria-hidden>→</span>
          </div>
        </Link>

        <Link href="/search" className="group block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:border-blue-300 dark:hover:border-sky-700">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center size-9 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-sky-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
            </span>
            <div className="text-lg font-semibold">Search & browse</div>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-400">Read every question, filter by topic, see the correct answers.</div>
          <div className="mt-4 text-sm font-medium text-blue-600 dark:text-sky-400 inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Open <span aria-hidden>→</span>
          </div>
        </Link>
      </section>

      {/* Topic breakdown */}
      <section className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Topics</h2>
          <Link href="/search" className="text-xs text-blue-600 dark:text-sky-400 hover:underline">browse all →</Link>
        </div>
        <ul className="grid sm:grid-cols-2 gap-1.5">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <Link
                href={`/search?cat=${encodeURIComponent(c)}`}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors group"
              >
                <span className={`inline-block size-2.5 rounded-full ${categoryDotClass(c)}`} />
                <span className="flex-1 text-sm truncate group-hover:text-blue-700 dark:group-hover:text-sky-300">
                  {shortLabel(c)}
                </span>
                <span className="tabular-nums text-xs text-slate-500 dark:text-slate-400">
                  {counts[c] ?? 0}
                </span>
              </Link>
            </li>
          ))}
          {uncategorized > 0 && (
            <li className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-500 dark:text-slate-500 text-sm">
              <span className="inline-block size-2.5 rounded-full bg-slate-400" />
              <span className="flex-1">uncategorized</span>
              <span className="tabular-nums text-xs">{uncategorized}</span>
            </li>
          )}
        </ul>
      </section>
    </main>
  );
}
