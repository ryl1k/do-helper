"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, categoryDotClass, shortLabel } from "@/lib/categories";
import {
  clearHistory,
  loadProfile,
  setProfileName,
  summarize,
  type ProfileData,
} from "@/lib/stats";

export default function ProfilePage() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const p = loadProfile();
    setData(p);
    setDraft(p.name);
  }, []);

  const stats = useMemo(() => (data ? summarize(data.quizzes) : null), [data]);

  function saveName() {
    setProfileName(draft.trim());
    setData((d) => (d ? { ...d, name: draft.trim() } : d));
    setEditing(false);
  }

  function reset() {
    if (!confirm("Clear all quiz history? Your name stays.")) return;
    clearHistory();
    setData((d) => (d ? { ...d, quizzes: [] } : d));
  }

  if (!data) {
    return (
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-40 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="grid sm:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-900" />)}
          </div>
        </div>
      </main>
    );
  }

  const empty = data.quizzes.length === 0;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Identity */}
      <header className="flex items-center gap-4">
        <div className="size-14 sm:size-16 rounded-2xl bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm">
          {(data.name || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2 items-center">
              <input
                value={draft}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                placeholder="Your name"
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-base focus:border-blue-500 dark:focus:border-sky-500"
              />
              <button type="button" onClick={saveName} className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 font-medium">save</button>
            </div>
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                {data.name || "Anonymous"}
              </h1>
              <button
                type="button"
                onClick={() => { setDraft(data.name); setEditing(true); }}
                className="text-xs text-blue-600 dark:text-sky-400 hover:underline"
              >
                {data.name ? "edit name" : "set name"}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Headline stats */}
      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label="Quizzes" value={data.quizzes.length} />
        <Stat label="Questions" value={stats?.totalQ ?? 0} />
        <Stat
          label="Accuracy"
          value={stats ? `${Math.round(stats.accuracy * 100)}%` : "—"}
          tone={stats && stats.accuracy >= 0.8 ? "good" : stats && stats.accuracy >= 0.5 ? "ok" : "low"}
        />
      </section>

      {empty ? (
        <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="text-slate-600 dark:text-slate-400">No quizzes yet.</div>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold transition-colors"
          >
            Take your first quiz →
          </Link>
        </div>
      ) : (
        <>
          {/* Per-category accuracy */}
          {stats && (
            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
                Accuracy by topic
              </h2>
              <ul className="space-y-2">
                {CATEGORIES.map((c) => {
                  const s = stats.perCat[c];
                  const total = s?.total ?? 0;
                  const correct = s?.correct ?? 0;
                  const acc = total === 0 ? 0 : correct / total;
                  return (
                    <li key={c} className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`size-2 rounded-full ${categoryDotClass(c)}`} />
                        <span className="flex-1 truncate text-slate-700 dark:text-slate-300">{shortLabel(c)}</span>
                        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">
                          {total > 0 ? `${correct}/${total}` : "—"}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        {total > 0 && (
                          <div
                            className="h-full bg-blue-600 dark:bg-sky-500 transition-[width] duration-300"
                            style={{ width: `${acc * 100}%` }}
                          />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {/* Recent activity */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
                Recent quizzes
              </h2>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
              >
                clear history
              </button>
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
              {data.quizzes.slice(0, 10).map((q, i) => {
                const pct = q.total ? Math.round((q.correct / q.total) * 100) : 0;
                return (
                  <li key={i} className="px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm">
                        <b className="tabular-nums">{q.correct}/{q.total}</b>
                        <span className="text-slate-500 dark:text-slate-400 ml-2 text-xs">{new Date(q.date).toLocaleString()}</span>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {q.categories.length === CATEGORIES.length
                          ? "all topics"
                          : q.categories.map((c) => shortLabel(c)).join(", ")}
                      </div>
                    </div>
                    <span
                      className={
                        "text-sm font-semibold tabular-nums " +
                        (pct >= 80 ? "text-emerald-600 dark:text-emerald-400"
                          : pct >= 50 ? "text-blue-600 dark:text-sky-400"
                          : "text-amber-600 dark:text-amber-400")
                      }
                    >
                      {pct}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "good" | "ok" | "low" }) {
  const toneCls =
    tone === "good" ? "text-emerald-600 dark:text-emerald-400"
    : tone === "low" ? "text-amber-600 dark:text-amber-400"
    : tone === "ok" ? "text-blue-600 dark:text-sky-400"
    : "";
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5">
      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</div>
      <div className={`text-2xl sm:text-3xl font-semibold tabular-nums mt-1 ${toneCls}`}>{value}</div>
    </div>
  );
}
