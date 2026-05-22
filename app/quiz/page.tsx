"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CATEGORIES, categoryDotClass, shortLabel } from "@/lib/categories";
import { loadQuestions, letter, type Question } from "@/lib/questions";
import { recordQuiz } from "@/lib/stats";

type Phase = "setup" | "playing" | "done";

interface Attempt {
  question: Question;
  chosen: number[];
  correct: boolean;
}

const COUNT_OPTIONS = [10, 25, 50, "all"] as const;
type CountChoice = (typeof COUNT_OPTIONS)[number];

export default function QuizPage() {
  const [all, setAll] = useState<Question[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions().then(setAll).catch((e) => setErr(String(e?.message ?? e)));
  }, []);

  const [phase, setPhase] = useState<Phase>("setup");
  const [picked, setPicked] = useState<Set<string>>(new Set(CATEGORIES));
  const [count, setCount] = useState<CountChoice>(25);
  const [pool, setPool] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const q of all ?? []) for (const c of q.categories) m[c] = (m[c] ?? 0) + 1;
    return m;
  }, [all]);

  const eligible = useMemo(() => {
    if (!all) return [];
    return all.filter(
      (q) => q.correct_indices.length > 0 && q.categories.some((c) => picked.has(c)),
    );
  }, [all, picked]);

  function start() {
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    const n = count === "all" ? shuffled.length : Math.min(count, shuffled.length);
    setPool(shuffled.slice(0, n));
    setIdx(0);
    setChosen(new Set());
    setRevealed(false);
    setAttempts([]);
    setPhase("playing");
  }

  function toggleChoice(i: number) {
    if (revealed) return;
    setChosen((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function submit() {
    if (revealed || chosen.size === 0) return;
    const q = pool[idx];
    const truth = new Set(q.correct_indices);
    const isCorrect = chosen.size === truth.size && [...chosen].every((c) => truth.has(c));
    setAttempts((a) => [...a, { question: q, chosen: [...chosen].sort((a, b) => a - b), correct: isCorrect }]);
    setRevealed(true);
  }

  function next() {
    if (idx + 1 >= pool.length) {
      // Persist on completion.
      const finalAttempts = attempts;
      const finalScore = finalAttempts.filter((a) => a.correct).length;
      recordQuiz({
        date: new Date().toISOString(),
        categories: [...picked],
        total: finalAttempts.length,
        correct: finalScore,
        outcomes: finalAttempts.map((a) => ({
          number: a.question.number,
          correct: a.correct,
          categories: a.question.categories,
        })),
      });
      setPhase("done");
      return;
    }
    setIdx((i) => i + 1);
    setChosen(new Set());
    setRevealed(false);
  }

  const cur = pool[idx];
  const score = attempts.filter((a) => a.correct).length;

  // ----- SETUP -----
  if (phase === "setup") {
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        <header>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Quiz</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose your topics and how many questions you want.
          </p>
        </header>

        {err && <div className="text-red-500 text-sm">{err}</div>}
        {!all && !err && <SkeletonSetup />}

        {all && (
          <>
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">Topics</h2>
                <div className="flex gap-1">
                  <SmallBtn onClick={() => setPicked(new Set(CATEGORIES))}>all</SmallBtn>
                  <SmallBtn onClick={() => setPicked(new Set())}>none</SmallBtn>
                </div>
              </div>
              <ul className="grid gap-1.5">
                {CATEGORIES.map((c) => {
                  const on = picked.has(c);
                  return (
                    <li key={c}>
                      <button
                        type="button"
                        onClick={() =>
                          setPicked((p) => {
                            const n = new Set(p);
                            n.has(c) ? n.delete(c) : n.add(c);
                            return n;
                          })
                        }
                        className={
                          "w-full text-left flex items-center gap-3 rounded-xl px-4 py-3 border transition-all " +
                          (on
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 dark:border-sky-500/60"
                            : "border-slate-200 hover:border-blue-300 hover:bg-slate-50 " +
                              "dark:border-slate-800 dark:hover:border-slate-700 dark:hover:bg-slate-900")
                        }
                      >
                        <span
                          className={
                            "size-5 rounded-md border flex items-center justify-center transition-colors " +
                            (on
                              ? "bg-blue-600 border-blue-600 text-white dark:bg-sky-500 dark:border-sky-500 dark:text-slate-950"
                              : "border-slate-300 dark:border-slate-700")
                          }
                        >
                          {on && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden><polyline points="20 6 9 17 4 12" /></svg>
                          )}
                        </span>
                        <span className={`inline-block size-2 rounded-full ${categoryDotClass(c)}`} />
                        <span className="flex-1 text-sm sm:text-base">{shortLabel(c)}</span>
                        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{counts[c] ?? 0}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">How many questions</h2>
              <div className="grid grid-cols-4 gap-2">
                {COUNT_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setCount(opt)}
                    className={
                      "px-3 py-2.5 rounded-xl border text-sm font-medium transition-all " +
                      (count === opt
                        ? "bg-blue-600 border-blue-600 text-white dark:bg-sky-500 dark:border-sky-500 dark:text-slate-950 shadow-sm"
                        : "border-slate-200 hover:border-blue-300 dark:border-slate-800 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300")
                    }
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </section>

            <button
              type="button"
              disabled={eligible.length === 0}
              onClick={start}
              className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-slate-950 text-base font-semibold shadow-sm transition-colors"
            >
              Start — {Math.min(count === "all" ? eligible.length : count, eligible.length)} of {eligible.length} eligible
            </button>
          </>
        )}
      </main>
    );
  }

  // ----- PLAYING -----
  if (phase === "playing" && cur) {
    const truth = new Set(cur.correct_indices);
    const multi = cur.correct_indices.length > 1;
    const progress = (idx / pool.length) * 100;
    const isLast = idx + 1 >= pool.length;
    return (
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-5">
        <header className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <Link href="/" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-sky-300">← exit</Link>
            <span className="tabular-nums text-slate-600 dark:text-slate-300">
              <b>{idx + 1}</b> <span className="opacity-50">/ {pool.length}</span>
            </span>
            <span className="tabular-nums text-slate-600 dark:text-slate-300">
              score: <b className="text-blue-600 dark:text-sky-400">{score}</b>
            </span>
          </div>
          <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-sky-500 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </header>

        <div className="space-y-1">
          <div className="text-xs text-slate-500 dark:text-slate-500">#{cur.number}</div>
          <h2 className="text-lg sm:text-xl font-medium leading-snug text-slate-900 dark:text-slate-100">
            {cur.text}
          </h2>
          {multi && (
            <div className="text-xs text-amber-700 dark:text-amber-400 mt-2">
              Multiple correct — select all that apply.
            </div>
          )}
        </div>

        <ol className="space-y-2">
          {cur.options.map((opt, i) => {
            const isChosen = chosen.has(i);
            const isCorrect = truth.has(i);
            let cls = "border-slate-200 hover:border-blue-300 dark:border-slate-800 dark:hover:border-slate-700 bg-white dark:bg-slate-900";
            let leftCls = "border-slate-300 dark:border-slate-700";
            if (revealed) {
              if (isCorrect) {
                cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500/60";
                leftCls = "border-emerald-500 bg-emerald-500 text-white";
              } else if (isChosen) {
                cls = "border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-500/60";
                leftCls = "border-red-500 bg-red-500 text-white";
              }
            } else if (isChosen) {
              cls = "border-blue-500 bg-blue-50 dark:bg-blue-950/40 dark:border-sky-500/60";
              leftCls = "border-blue-600 bg-blue-600 text-white dark:bg-sky-500 dark:border-sky-500 dark:text-slate-950";
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggleChoice(i)}
                  disabled={revealed}
                  className={"w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 min-h-[52px] transition-all " + cls + (revealed ? " cursor-default" : " active:scale-[0.99]")}
                >
                  <span className={"size-7 shrink-0 rounded-md border flex items-center justify-center text-sm font-medium transition-colors " + leftCls}>
                    {revealed && isCorrect ? "✓" : revealed && isChosen ? "✕" : letter(i)}
                  </span>
                  <span className="flex-1 text-sm sm:text-base leading-snug pt-0.5">{opt}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {!revealed ? (
          <button
            type="button"
            onClick={submit}
            disabled={chosen.size === 0}
            className="w-full px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-slate-950 font-semibold transition-colors"
          >
            Submit
          </button>
        ) : (
          <button
            type="button"
            onClick={next}
            autoFocus
            className="w-full px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold hover:bg-slate-800 dark:hover:bg-white transition-colors"
          >
            {isLast ? "Finish" : "Next →"}
          </button>
        )}
      </main>
    );
  }

  // ----- DONE -----
  const wrong = attempts.filter((a) => !a.correct);
  const pct = attempts.length ? Math.round((score / attempts.length) * 100) : 0;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <header className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Done</h1>
        <div className="inline-flex items-baseline gap-1 text-5xl sm:text-6xl font-semibold tabular-nums">
          <span className={pct >= 80 ? "text-emerald-600 dark:text-emerald-400" : pct >= 50 ? "text-blue-600 dark:text-sky-400" : "text-amber-600 dark:text-amber-400"}>
            {pct}
          </span>
          <span className="text-2xl text-slate-500 dark:text-slate-400">%</span>
        </div>
        <div className="text-slate-600 dark:text-slate-400">
          <b className="tabular-nums">{score}</b> of <b className="tabular-nums">{attempts.length}</b> correct
        </div>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setPhase("setup")}
          className="px-5 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold transition-colors"
        >
          New quiz
        </button>
        <button
          type="button"
          onClick={start}
          className="px-5 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700 font-medium transition-colors"
        >
          Same settings again
        </button>
      </div>

      {wrong.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">
            Review {wrong.length} wrong
          </h2>
          <ol className="space-y-3">
            {wrong.map((a) => (
              <li key={a.question.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 space-y-3">
                <div className="text-sm sm:text-base">
                  <span className="text-xs text-slate-500 dark:text-slate-500 mr-2">#{a.question.number}</span>
                  {a.question.text}
                </div>
                <ol className="space-y-1.5 text-sm">
                  {a.question.options.map((opt, i) => {
                    const isCorrect = a.question.correct_indices.includes(i);
                    const wasChosen = a.chosen.includes(i);
                    let cls = "border-slate-200 dark:border-slate-800";
                    if (isCorrect) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500/60";
                    else if (wasChosen) cls = "border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-500/60";
                    return (
                      <li key={i} className={"flex items-start gap-2.5 rounded-lg border px-3 py-2 " + cls}>
                        <span className="opacity-50 w-4 shrink-0 text-xs pt-0.5">{letter(i)}.</span>
                        <span className="flex-1">{opt}</span>
                        {isCorrect && <span className="text-xs text-emerald-600 dark:text-emerald-400 shrink-0">correct</span>}
                        {!isCorrect && wasChosen && <span className="text-xs text-red-600 dark:text-red-400 shrink-0">your pick</span>}
                      </li>
                    );
                  })}
                </ol>
              </li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}

function SmallBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-xs px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-blue-300 hover:text-blue-700 dark:hover:border-slate-700 dark:hover:text-sky-300 transition-colors"
    >
      {children}
    </button>
  );
}

function SkeletonSetup() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 w-20 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="space-y-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-12 bg-slate-100 dark:bg-slate-900 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
