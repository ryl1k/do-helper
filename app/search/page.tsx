"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATEGORIES, categoryBadgeClass, categoryDotClass, shortLabel } from "@/lib/categories";
import { loadQuestions, letter, type Question } from "@/lib/questions";

export default function SearchPage() {
  return (
    <Suspense fallback={<SkeletonPage />}>
      <SearchInner />
    </Suspense>
  );
}

function SkeletonPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <SkeletonList />
    </main>
  );
}

function SearchInner() {
  const params = useSearchParams();
  const initialCat = params.get("cat");
  const [qs, setQs] = useState<Question[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(initialCat);
  const [reveal, setReveal] = useState(true);

  useEffect(() => {
    loadQuestions().then(setQs).catch((e) => setErr(String(e?.message ?? e)));
  }, []);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const q of qs ?? []) for (const c of q.categories) m[c] = (m[c] ?? 0) + 1;
    return m;
  }, [qs]);

  const filtered = useMemo(() => {
    if (!qs) return [];
    const needle = query.trim().toLowerCase();
    return qs.filter((q) => {
      if (activeCat && !q.categories.includes(activeCat)) return false;
      if (!needle) return true;
      if (q.text.toLowerCase().includes(needle)) return true;
      return q.options.some((o) => o.toLowerCase().includes(needle));
    });
  }, [qs, query, activeCat]);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Search</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {qs ? `${qs.length} questions in the bank` : err ? "" : "Loading…"}
        </p>
      </header>

      {/* Search input — big and prominent */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        </span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Шукати питання або варіант…"
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-10 py-3 text-base focus:border-blue-500 dark:focus:border-sky-500 transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            aria-label="Clear"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        )}
      </div>

      {/* Topic pills */}
      <div className="flex flex-wrap gap-2 items-center">
        <Pill label="All" count={qs?.length ?? 0} active={activeCat === null} onClick={() => setActiveCat(null)} />
        {CATEGORIES.map((c) => (
          <Pill
            key={c}
            label={shortLabel(c)}
            count={counts[c] ?? 0}
            active={activeCat === c}
            dot={categoryDotClass(c)}
            onClick={() => setActiveCat(activeCat === c ? null : c)}
          />
        ))}
        <label className="ml-auto inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            checked={reveal}
            onChange={(e) => setReveal(e.target.checked)}
            className="accent-blue-600 dark:accent-sky-500"
          />
          show answers
        </label>
      </div>

      <div className="text-xs text-slate-500 dark:text-slate-500">
        {filtered.length} shown
      </div>

      {err && <div className="text-sm text-red-500">{err}</div>}

      <ol className="space-y-3">
        {filtered.map((q) => <Card key={q.id} q={q} reveal={reveal} />)}
      </ol>

      {qs && filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
          <div className="text-base mb-1">No matches</div>
          <div className="text-xs">Try a different search or topic filter.</div>
        </div>
      )}
      {!qs && !err && <SkeletonList />}
    </main>
  );
}

function Card({ q, reveal }: { q: Question; reveal: boolean }) {
  const [open, setOpen] = useState(reveal);
  useEffect(() => { setOpen(reveal); }, [reveal]);
  const noAnswer = q.correct_indices.length === 0;

  return (
    <li className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden transition-colors hover:border-blue-300 dark:hover:border-slate-700">
      <div className="p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-500 tabular-nums shrink-0 mt-0.5">#{q.number}</span>
          <h3 className="text-sm sm:text-base font-medium leading-snug flex-1">{q.text}</h3>
        </div>

        <ol className="space-y-1.5">
          {q.options.map((opt, i) => {
            const isCorrect = q.correct_indices.includes(i);
            const show = open && isCorrect;
            return (
              <li
                key={i}
                className={
                  "flex items-start gap-2.5 rounded-lg border px-3 py-2 text-sm transition-colors " +
                  (show
                    ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500/60"
                    : "border-slate-200 dark:border-slate-800")
                }
              >
                <span className="opacity-50 w-4 shrink-0 text-xs pt-0.5">{letter(i)}.</span>
                <span className="flex-1">{opt}</span>
                {show && <span className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0">✓</span>}
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-2">
          {q.categories.map((c) => (
            <span key={c} className={`text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border ${categoryBadgeClass(c)}`}>
              {shortLabel(c)}
            </span>
          ))}
          {q.categories.length === 0 && (
            <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500">
              uncategorized
            </span>
          )}
          {noAnswer && (
            <span className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border border-amber-400 dark:border-amber-500/60 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
              no recorded answer
            </span>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="ml-auto text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-300 transition-colors"
          >
            {open ? "hide" : "reveal"}
          </button>
        </div>
      </div>
    </li>
  );
}

function Pill({
  label, count, active, dot, onClick,
}: { label: string; count: number; active: boolean; dot?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all " +
        (active
          ? "bg-blue-600 text-white border-blue-600 dark:bg-sky-500 dark:text-slate-950 dark:border-sky-500"
          : "border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700 " +
            "dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900 dark:text-slate-300")
      }
    >
      {dot && <span className={`inline-block size-2 rounded-full ${dot}`} />}
      <span>{label}</span>
      <span className={"tabular-nums " + (active ? "opacity-80" : "opacity-50")}>{count}</span>
    </button>
  );
}

function SkeletonList() {
  return (
    <ol className="space-y-3 animate-pulse">
      {[...Array(4)].map((_, i) => (
        <li key={i} className="h-40 rounded-xl bg-slate-100 dark:bg-slate-900" />
      ))}
    </ol>
  );
}
