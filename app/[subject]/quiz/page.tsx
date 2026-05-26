"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { Kbd } from "@/components/shell/Kbd";
import { loadQuestions, letter, type Question } from "@/lib/questions";
import { loadTopics, topicDotClass, topicShortLabel, effectiveTopicSlugs, type SubjectTopics } from "@/lib/topics";
import { recordQuiz } from "@/lib/stats";
import { getOrCreateAnonId, useSession } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-client";

type Phase = "setup" | "playing" | "done";

interface Attempt {
  question: Question;
  chosen: number[];
  correct: boolean;
}

export default function QuizPage() {
  const { subject } = useParams<{ subject: string }>();
  const search = useSearchParams();
  const weakOnly = search.get("weak") === "1";
  const { session } = useSession();

  const [all, setAll] = useState<Question[] | null>(null);
  const [topics, setTopics] = useState<SubjectTopics | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!subject) return;
    Promise.all([loadQuestions(subject), loadTopics(subject)])
      .then(([q, t]) => { setAll(q); setTopics(t); })
      .catch((e) => setErr(String(e?.message ?? e)));
  }, [subject]);

  const [phase, setPhase] = useState<Phase>("setup");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [count, setCount] = useState(25);
  const [pool, setPool] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<Set<number>>(new Set());
  const [revealed, setRevealed] = useState(false);
  const [attempts, setAttempts] = useState<Attempt[]>([]);

  // Default-select all topics once loaded.
  useEffect(() => {
    if (topics && picked.size === 0) setPicked(new Set(topics.topics.map((t) => t.slug)));
    // eslint-disable-next-line
  }, [topics]);

  const perTopicCount = useMemo(() => {
    const m: Record<string, number> = {};
    for (const q of all ?? []) {
      for (const c of effectiveTopicSlugs(q.categories)) m[c] = (m[c] ?? 0) + 1;
    }
    return m;
  }, [all]);

  const eligible = useMemo(() => {
    if (!all) return [];
    return all.filter((q) => {
      if (q.correct_indices.length === 0) return false;
      const eff = effectiveTopicSlugs(q.categories);
      return eff.some((c) => picked.has(c));
    });
  }, [all, picked]);

  const maxAvailable = Math.max(1, eligible.length);
  const requestedCount = Math.max(1, Math.min(count || 1, maxAvailable));

  function start() {
    const shuffled = [...eligible].sort(() => Math.random() - 0.5);
    setPool(shuffled.slice(0, Math.min(requestedCount, shuffled.length)));
    setIdx(0); setChosen(new Set()); setRevealed(false); setAttempts([]);
    setPhase("playing");
  }

  // ⌘↵ / Ctrl+↵ launches from setup.
  useEffect(() => {
    if (phase !== "setup") return;
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && eligible.length > 0) {
        e.preventDefault(); start();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [phase, eligible]);

  function toggleChoice(i: number) {
    if (revealed) return;
    setChosen((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }

  function submit() {
    if (revealed || chosen.size === 0) return;
    const q = pool[idx];
    const truth = new Set(q.correct_indices);
    const isCorrect = chosen.size === truth.size && [...chosen].every((c) => truth.has(c));
    setAttempts((prev) => {
      const next = [...prev];
      next[idx] = { question: q, chosen: [...chosen].sort((a, b) => a - b), correct: isCorrect };
      return next;
    });
    setRevealed(true);
  }

  function next() {
    if (idx + 1 >= pool.length) {
      const final = attempts.filter(Boolean) as Attempt[];
      const score = final.filter((a) => a.correct).length;
      recordQuiz({
        date: new Date().toISOString(),
        subject,
        categories: [...picked],
        total: final.length,
        correct: score,
        outcomes: final.map((a) => ({ number: a.question.number, correct: a.correct, chosen: a.chosen, categories: a.question.categories })),
      });
      void writeAttemptsToServer(final, session?.user?.id ?? null);
      setPhase("done");
      return;
    }
    setIdx(idx + 1); setChosen(new Set()); setRevealed(false);
  }

  function previous() {
    if (idx === 0) return;
    const newIdx = idx - 1;
    setIdx(newIdx);
    const prev = attempts[newIdx];
    if (prev) { setChosen(new Set(prev.chosen)); setRevealed(true); }
    else { setChosen(new Set()); setRevealed(false); }
  }

  // Number-key + Enter shortcuts during playing.
  useEffect(() => {
    if (phase !== "playing") return;
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const cur = pool[idx]; if (!cur) return;
      if (e.key === "Enter") { e.preventDefault(); revealed ? next() : submit(); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); previous(); return; }
      const n = parseInt(e.key, 10);
      if (!isNaN(n) && n >= 1 && n <= cur.options.length) {
        e.preventDefault(); toggleChoice(n - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [phase, idx, revealed, pool, chosen]);

  // ── SETUP
  if (phase === "setup") {
    return (
      <AppShell active="test" subject={subject} crumbs={[
        { label: "Тест" },
      ]}>
        {err && <div className="p-4 text-bad text-sm">{err}</div>}
        {(!all || !topics) && (
          <div className="px-10 py-12 text-ink-mute">Завантаження…</div>
        )}
        {all && topics && (
          <SetupView
            topics={topics}
            picked={picked}
            setPicked={setPicked}
            count={count}
            setCount={setCount}
            perTopicCount={perTopicCount}
            eligible={eligible.length}
            maxAvailable={maxAvailable}
            onStart={start}
            weakOnly={weakOnly}
          />
        )}
      </AppShell>
    );
  }

  // ── PLAYING
  if (phase === "playing" && pool[idx]) {
    const cur = pool[idx];
    const truth = new Set(cur.correct_indices);
    const multi = cur.correct_indices.length > 1;
    return (
      <PlayingView
        subject={subject}
        topics={topics!}
        pool={pool}
        idx={idx}
        cur={cur}
        truth={truth}
        multi={multi}
        chosen={chosen}
        revealed={revealed}
        attempts={attempts}
        onToggle={toggleChoice}
        onSubmit={submit}
        onNext={next}
        onPrevious={previous}
      />
    );
  }

  // ── DONE
  return (
    <AppShell active="test" subject={subject} crumbs={[
      { label: "Тест", href: `/${subject}/quiz` },
      { label: "Результати" },
    ]}>
      <DoneView
        subject={subject}
        topics={topics}
        attempts={attempts}
        onNew={() => setPhase("setup")}
        onSame={start}
      />
    </AppShell>
  );
}

// ───────────────────────────── SETUP ─────────────────────────────

function SetupView({
  topics, picked, setPicked, count, setCount, perTopicCount, eligible, maxAvailable, onStart, weakOnly,
}: {
  topics: SubjectTopics;
  picked: Set<string>;
  setPicked: (s: Set<string>) => void;
  count: number;
  setCount: (n: number) => void;
  perTopicCount: Record<string, number>;
  eligible: number;
  maxAvailable: number;
  onStart: () => void;
  weakOnly: boolean;
}) {
  const [showExpl, setShowExpl] = useState(true);
  const [shuffleOpts, setShuffleOpts] = useState(true);
  const [timer, setTimer] = useState(false);
  const [weak, setWeak] = useState(weakOnly);

  function selAll() { setPicked(new Set(topics.topics.map((t) => t.slug))); }
  function selNone() { setPicked(new Set()); }

  const selectedTopics = topics.topics.filter((t) => picked.has(t.slug));
  const pickedCount = Math.min(count, maxAvailable);
  const minutesEst = Math.ceil(pickedCount * 0.5); // ~30s per question

  return (
    <div className="grid lg:grid-cols-[1fr_360px] min-h-full">
      {/* Left: settings */}
      <div className="px-6 sm:px-10 py-7 overflow-hidden">
        <div className="eyebrow mb-2">Новий тест</div>
        <h1 className="text-[22px] font-semibold tracking-tighter2">Налаштування</h1>
        <p className="text-[13px] text-ink-dim mt-1">
          Обери теми та кількість питань. <Kbd>⌘</Kbd>+<Kbd>↵</Kbd> щоб запустити.
        </p>

        <section className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <div className="eyebrow">Теми</div>
            <div className="text-[11px] flex items-center gap-1.5">
              <button onClick={selAll} className="text-ink-dim hover:text-ink">усі</button>
              <span className="text-ink-mute">·</span>
              <button onClick={selNone} className="text-ink-dim hover:text-ink">жодної</button>
              <span className="text-ink-mute">·</span>
              <button onClick={() => {/* TODO: weak preselect */}} className="text-cyan hover:underline">слабкі</button>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 panel overflow-hidden">
            {topics.topics.map((t, i) => {
              const on = picked.has(t.slug);
              const cnt = perTopicCount[t.slug] ?? 0;
              const lastRow = i >= topics.topics.length - 2;
              const isLeft = i % 2 === 0;
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => {
                    const n = new Set(picked);
                    n.has(t.slug) ? n.delete(t.slug) : n.add(t.slug);
                    setPicked(n);
                  }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors hover:bg-surface2 ${!lastRow ? "border-b border-line" : ""} ${isLeft ? "sm:border-r sm:border-line" : ""}`}
                >
                  <span
                    className={`size-[14px] rounded border flex items-center justify-center shrink-0 ${
                      on ? "bg-cyan border-cyan" : "border-lineStrong"
                    }`}
                  >
                    {on && (
                      <svg width="9" height="9" viewBox="0 0 9 9">
                        <path d="M1 4.5L3.5 7L8 1.5" stroke="#0a0b0d" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`size-1.5 rounded-full ${topicDotClass(topics, t.slug)}`} />
                  <span className="text-[13px] flex-1 truncate">{topicShortLabel(topics, t.slug)}</span>
                  <span className="font-mono text-[11px] text-ink-mute tabular-nums">{cnt}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="eyebrow mb-2">Кількість питань</div>
          <div className="flex gap-3 items-center">
            <div className="w-[88px] h-10 border border-lineStrong rounded-md flex items-center justify-center font-mono text-lg bg-surface">
              <input
                type="number"
                min={1}
                max={maxAvailable}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(maxAvailable, Number(e.target.value) || 1)))}
                className="bg-transparent w-full h-full text-center outline-none font-mono"
              />
            </div>
            <div className="flex-1 relative h-1 rounded-full bg-surface2">
              <div className="absolute h-full bg-cyan rounded-full" style={{ width: `${(count / maxAvailable) * 100}%` }} />
              <input
                type="range"
                min={1}
                max={maxAvailable}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <span className="font-mono text-[11px] text-ink-mute whitespace-nowrap">макс {maxAvailable}</span>
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {[10, 25, 50, maxAvailable].map((n, i) => {
              const label = i === 3 ? "усі" : n;
              const active = count === n;
              return (
                <button
                  key={i}
                  onClick={() => setCount(Math.min(n, maxAvailable))}
                  className={
                    "px-3 py-1 rounded text-[11px] font-mono border transition-colors " +
                    (active ? "border-lineStrong bg-surface2 text-ink" : "border-line text-ink-dim hover:text-ink hover:border-lineStrong")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          <div className="eyebrow mb-2">Опції</div>
          <div className="space-y-2">
            <Toggle label="Показувати пояснення відразу" on={showExpl} onChange={setShowExpl} />
            <Toggle label="Перемішати варіанти" on={shuffleOpts} onChange={setShuffleOpts} />
            <Toggle label="Таймер · 60 сек на питання" on={timer} onChange={setTimer} />
            <Toggle label="Тільки слабкі питання (точність < 60%)" on={weak} onChange={setWeak} />
          </div>
        </section>
      </div>

      {/* Right: summary rail */}
      <aside className="border-t lg:border-t-0 lg:border-l border-line px-7 py-7 flex flex-col">
        <div className="eyebrow">Готовий до запуску</div>
        <div className="font-mono text-[56px] font-medium tracking-[-0.04em] mt-2">{pickedCount}</div>
        <div className="text-[13px] text-ink-dim">
          питань з <span className="text-ink">{picked.size} {picked.size === 1 ? "теми" : "тем"}</span>
        </div>
        <div className="text-[12px] text-ink-mute mt-1 font-mono">≈ {minutesEst} хв · {eligible} доступних</div>

        <div className="mt-4 panel p-3">
          <div className="eyebrow mb-2">Розподіл</div>
          <div className="h-1.5 flex rounded-full overflow-hidden bg-surface2">
            {selectedTopics.map((t) => (
              <div key={t.slug} className={`flex-1 ${topicDotClass(topics, t.slug)} opacity-85`} />
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {selectedTopics.slice(0, 8).map((t) => (
              <span key={t.slug} className="text-[10px] px-1.5 py-0.5 rounded bg-surface2 text-ink-dim font-mono inline-flex items-center gap-1">
                <span className={`size-1 rounded-full ${topicDotClass(topics, t.slug)}`} />
                {topicShortLabel(topics, t.slug)}
              </span>
            ))}
            {selectedTopics.length > 8 && (
              <span className="text-[10px] text-ink-mute font-mono">+{selectedTopics.length - 8}</span>
            )}
          </div>
        </div>

        <div className="flex-1" />
        <button
          onClick={onStart}
          disabled={eligible === 0}
          className="mt-4 py-3 px-4 rounded-lg bg-cyan text-canvas text-[13px] font-semibold flex items-center justify-center gap-2 hover:bg-cyan/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Старт <Kbd inverse>⌘ ↵</Kbd>
        </button>
        <div className="text-[11px] text-ink-mute text-center mt-2">
          {eligible === 0 ? "Обери хоча б одну тему" : "Або зберегти як шаблон"}
        </div>
      </aside>
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className="w-full flex items-center justify-between px-3 py-2 panel hover:border-lineStrong transition-colors text-left"
    >
      <span className="text-[13px]">{label}</span>
      <span className={`w-7 h-4 rounded-full relative border transition-colors ${on ? "bg-cyan border-cyan" : "bg-surface2 border-line"}`}>
        <span
          className={`absolute top-0.5 size-3 rounded-full transition-all ${on ? "bg-canvas left-3.5" : "bg-ink-dim left-0.5"}`}
        />
      </span>
    </button>
  );
}

// ───────────────────────────── PLAYING ─────────────────────────────

function PlayingView({
  subject, topics, pool, idx, cur, truth, multi, chosen, revealed, attempts, onToggle, onSubmit, onNext, onPrevious,
}: {
  subject: string;
  topics: SubjectTopics;
  pool: Question[];
  idx: number;
  cur: Question;
  truth: Set<number>;
  multi: boolean;
  chosen: Set<number>;
  revealed: boolean;
  attempts: Attempt[];
  onToggle: (i: number) => void;
  onSubmit: () => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const topicSlug = effectiveTopicSlugs(cur.categories)[0];
  const topicLabel = topicShortLabel(topics, topicSlug);
  const topicDot = topicDotClass(topics, topicSlug);
  const explanation = revealed
    ? cur.explanations?.find((e, i) => truth.has(i) && e?.trim()) ?? ""
    : "";

  return (
    <div className="h-screen flex flex-col bg-canvas text-ink">
      {/* Minimal topbar */}
      <div className="h-12 border-b border-line flex items-center px-5 gap-4">
        <Link href={`/${subject}`} className="size-[22px] rounded bg-surface2 flex items-center justify-center text-sm text-ink-dim hover:text-ink">×</Link>
        <div className="flex items-center gap-1.5 text-[12px] text-ink-dim">
          <span className="font-mono text-ink">{idx + 1}</span>
          <span className="text-ink-mute">/</span>
          <span className="font-mono">{pool.length}</span>
          <span className="text-ink-mute ml-2 hidden sm:inline">Тест</span>
        </div>
        <div className="flex-1 h-1 bg-surface2 rounded-full overflow-hidden max-w-[360px]">
          <div className="h-full bg-cyan transition-[width] duration-300" style={{ width: `${((idx) / pool.length) * 100}%` }} />
        </div>
        <div className="flex-1" />
        <div className="font-mono text-[12px] text-ink-dim hidden sm:block">
          {attempts.filter(Boolean).filter((a) => a.correct).length} правильно
        </div>
        <Link href={`/${subject}`} className="px-2.5 py-1 border border-line rounded text-[11px] text-ink-dim hover:text-ink hover:border-lineStrong flex items-center gap-1.5">
          Завершити <Kbd>esc</Kbd>
        </Link>
      </div>

      {/* Progress dots */}
      <div className="px-5 py-2 border-b border-line flex gap-[3px]">
        {pool.map((_, i) => {
          const att = attempts[i];
          let cls = "bg-surface2";
          if (att) cls = att.correct ? "bg-good" : "bg-bad";
          else if (i === idx) cls = "bg-cyan";
          return <div key={i} className={`flex-1 h-1 rounded-full ${cls}`} />;
        })}
      </div>

      {/* Body: rail | question | explanation */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_360px] lg:grid-cols-[64px_1fr_360px] min-h-0">
        {/* Bookmarks rail (desktop only) */}
        <div className="hidden lg:flex border-r border-line py-5 flex-col gap-1.5 items-center text-ink-dim text-sm">
          {[
            { i: "◆", k: "B", l: "Закладка" },
            { i: "⚑", k: "R", l: "Поскаржитись" },
            { i: "↺", k: "S", l: "Пропустити" },
          ].map((b, i) => (
            <button
              key={i}
              title={b.l}
              className="w-9 h-9 rounded-md flex flex-col items-center justify-center gap-0.5 hover:bg-surface hover:text-ink transition-colors"
            >
              <span>{b.i}</span>
              <span className="font-mono text-[9px] text-ink-mute">{b.k}</span>
            </button>
          ))}
        </div>

        {/* Question */}
        <div className="px-6 sm:px-12 py-8 overflow-y-auto flex flex-col">
          <div className="flex items-center gap-2.5 mb-3.5">
            <span className={`size-1.5 rounded-full ${topicDot}`} />
            <span className="font-mono text-[11px] text-ink-mute tracking-wider uppercase">
              {topicLabel} · #{cur.number}{multi ? " · кілька правильних" : ""}
            </span>
          </div>
          <h1 className="text-[20px] sm:text-[24px] font-medium tracking-tightish leading-snug max-w-3xl">
            {cur.text}
          </h1>

          <div className="mt-7 flex flex-col gap-2.5 max-w-3xl">
            {cur.options.map((opt, i) => {
              const isChosen = chosen.has(i);
              const isCorrect = truth.has(i);
              const showState = revealed && (isCorrect || isChosen);
              const stateCls = !showState
                ? isChosen ? "border-cyan bg-cyan-soft" : "border-line bg-surface hover:border-lineStrong"
                : isCorrect ? "border-good bg-good/[0.06]" : "border-bad bg-bad/[0.06]";
              const numCls = !showState
                ? isChosen ? "bg-cyan text-canvas" : "bg-surface2 text-ink-dim"
                : isCorrect ? "bg-good text-canvas" : "bg-bad text-canvas";
              const expl = revealed ? cur.explanations?.[i]?.trim() : "";
              return (
                <button
                  key={i}
                  onClick={() => onToggle(i)}
                  disabled={revealed}
                  className={`w-full text-left rounded-lg border px-4 py-3.5 transition-colors ${stateCls} ${revealed ? "cursor-default" : ""}`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`size-[26px] rounded-md flex items-center justify-center font-mono text-[12px] font-semibold ${numCls}`}>
                      {i + 1}
                    </div>
                    <span className="text-[14px] sm:text-[15px] flex-1">{opt}</span>
                    {revealed && isCorrect && <span className="font-mono text-[11px] text-good">✓ правильно</span>}
                    {revealed && isChosen && !isCorrect && <span className="font-mono text-[11px] text-bad">твій вибір</span>}
                  </div>
                  {expl && (
                    <div className={
                      "mt-2 ml-10 text-[12.5px] leading-relaxed " +
                      (isCorrect ? "text-good" : isChosen ? "text-bad" : "text-ink-dim")
                    }>
                      {expl}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1" />
          <div className="flex items-center gap-2.5 mt-7">
            <button
              onClick={onPrevious}
              disabled={idx === 0}
              className="px-3.5 py-2.5 border border-line rounded-md text-[13px] text-ink-dim hover:text-ink hover:border-lineStrong flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Попереднє <Kbd>←</Kbd>
            </button>
            <div className="flex-1" />
            <span className="font-mono text-[11px] text-ink-mute hidden sm:block">
              {revealed ? "↵ далі" : "натисни 1–4 щоб обрати"}
            </span>
            {!revealed ? (
              <button
                onClick={onSubmit}
                disabled={chosen.size === 0}
                className="px-5 py-2.5 rounded-md bg-cyan text-canvas text-[13px] font-semibold flex items-center gap-2 hover:bg-cyan/90 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Перевірити <Kbd inverse>↵</Kbd>
              </button>
            ) : (
              <button
                onClick={onNext}
                autoFocus
                className="px-5 py-2.5 rounded-md bg-cyan text-canvas text-[13px] font-semibold flex items-center gap-2 hover:bg-cyan/90"
              >
                {idx + 1 === pool.length ? "Завершити" : "Далі"} <Kbd inverse>↵</Kbd>
              </button>
            )}
          </div>
        </div>

        {/* Right: explanation panel */}
        <aside className="border-t md:border-t-0 md:border-l border-line bg-surface p-7 overflow-y-auto hidden md:flex flex-col">
          {!revealed && (
            <div className="text-[12px] text-ink-mute italic">Пояснення з'явиться після відповіді.</div>
          )}
          {revealed && (
            <>
              <div className="eyebrow text-cyan mb-2.5">Пояснення</div>
              <div className="text-[14px] leading-relaxed">
                {explanation || "Для цього питання поки немає пояснення."}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

// ───────────────────────────── DONE ─────────────────────────────

function DoneView({
  subject, topics, attempts, onNew, onSame,
}: {
  subject: string;
  topics: SubjectTopics | null;
  attempts: Attempt[];
  onNew: () => void;
  onSame: () => void;
}) {
  const wrong = attempts.filter((a) => !a.correct);
  const score = attempts.length - wrong.length;
  const pct = attempts.length ? Math.round((score / attempts.length) * 100) : 0;
  const totalSec = useMemo(() => Math.max(1, attempts.length * 27), [attempts]); // placeholder
  const avgSec = Math.round(totalSec / Math.max(1, attempts.length));

  const perTopic = useMemo(() => {
    const m: Record<string, { total: number; correct: number }> = {};
    for (const a of attempts) {
      for (const c of effectiveTopicSlugs(a.question.categories)) {
        const s = m[c] ?? { total: 0, correct: 0 };
        s.total += 1; if (a.correct) s.correct += 1;
        m[c] = s;
      }
    }
    return Object.entries(m).map(([slug, s]) => ({ slug, ...s })).sort((a, b) => b.total - a.total);
  }, [attempts]);

  return (
    <div className="min-h-full">
      <div className="grid lg:grid-cols-2 gap-8 px-6 sm:px-10 py-8 border-b border-line">
        <div>
          <div className="eyebrow">Сесія завершена · {formatDuration(totalSec)}</div>
          <h1 className="text-[32px] font-semibold tracking-tighter2 mt-2">
            {score} з {attempts.length} правильно
          </h1>
          <div className="flex items-baseline gap-5 mt-3">
            <div>
              <div className={`font-mono text-[44px] tracking-[-0.04em] ${pct >= 80 ? "text-good" : pct >= 50 ? "text-cyan" : "text-warn"}`}>
                {pct}<span className="text-2xl text-ink-mute">%</span>
              </div>
              <div className="eyebrow">Точність</div>
            </div>
            <div className="w-px h-14 bg-line" />
            <div>
              <div className="font-mono text-[22px] text-ink tracking-tighter2">{formatDuration(totalSec)}</div>
              <div className="eyebrow">Час</div>
            </div>
            <div>
              <div className="font-mono text-[22px] text-ink tracking-tighter2">{avgSec} с</div>
              <div className="eyebrow">Середній</div>
            </div>
          </div>
        </div>
        <div>
          <div className="eyebrow mb-2.5">По темах</div>
          {topics && perTopic.map((t) => {
            const acc = t.total ? t.correct / t.total : 0;
            const weak = acc < 0.5;
            return (
              <div key={t.slug} className="flex items-center gap-2.5 mb-2">
                <span className={`size-1.5 rounded-full ${topicDotClass(topics, t.slug)}`} />
                <span className="text-[13px] flex-1">{topicShortLabel(topics, t.slug)}</span>
                <span className="flex gap-0.5">
                  {Array.from({ length: t.total }).map((_, j) => (
                    <span key={j} className={`w-1.5 h-3 rounded-sm ${j < t.correct ? topicDotClass(topics, t.slug) : "bg-white/[0.08]"}`} />
                  ))}
                </span>
                <span className={`font-mono text-[12px] w-12 text-right tabular-nums ${weak ? "text-warn" : "text-ink-dim"}`}>
                  {t.correct}/{t.total}
                </span>
              </div>
            );
          })}
          {perTopic.length === 0 && <div className="text-[12px] text-ink-mute">—</div>}
        </div>
      </div>

      <div className="px-6 sm:px-10 py-6">
        {wrong.length > 0 && (
          <>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[13px] font-medium">Помилки · {wrong.length} {wrong.length === 1 ? "питання" : "питань"}</h2>
              <span className="text-[11px] text-ink-mute">Фільтр: <span className="text-ink">помилкові</span> · усі</span>
            </div>
            <div className="panel divide-y divide-line overflow-hidden">
              {wrong.map((a) => {
                const topicSlug = effectiveTopicSlugs(a.question.categories)[0];
                const userText = a.chosen.map((i) => a.question.options[i]).join(", ") || "—";
                const rightText = a.question.correct_indices.map((i) => a.question.options[i]).join(", ");
                return (
                  <div key={a.question.id} className="grid grid-cols-[40px_1fr_120px_90px] gap-3.5 items-center px-4 py-3.5">
                    <span className="font-mono text-[12px] text-ink-mute">#{a.question.number}</span>
                    <div className="min-w-0">
                      <div className="text-[13px] truncate">{a.question.text}</div>
                      <div className="text-[11px] mt-1 text-ink-mute">
                        Ти: <span className="text-bad line-through">{userText}</span>
                        <span className="mx-2">·</span>
                        Правильно: <span className="text-good">{rightText}</span>
                      </div>
                    </div>
                    {topics && (
                      <span className="text-[11px] text-ink-dim font-mono inline-flex items-center gap-1.5">
                        <span className={`size-1.5 rounded-full ${topicDotClass(topics, topicSlug)}`} />
                        {topicShortLabel(topics, topicSlug)}
                      </span>
                    )}
                    <span className="text-[11px] text-cyan text-right">Переглянути →</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        <div className="flex gap-2.5 mt-6 flex-wrap">
          {wrong.length > 0 && (
            <button onClick={onSame} className="px-4 py-2.5 rounded-md bg-cyan text-canvas text-[13px] font-semibold flex items-center gap-2">
              Повторити помилки <Kbd inverse>R</Kbd>
            </button>
          )}
          <button onClick={onNew} className="px-4 py-2.5 rounded-md border border-lineStrong text-[13px] text-ink hover:bg-surface">
            Новий тест
          </button>
          <Link href={`/${subject}`} className="px-4 py-2.5 rounded-md border border-line text-[13px] text-ink-dim hover:text-ink">
            До предмета
          </Link>
        </div>
      </div>
    </div>
  );
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s} с`;
  return `${m} хв ${s.toString().padStart(2, "0")} с`;
}

async function writeAttemptsToServer(attempts: Attempt[], userId: string | null) {
  if (attempts.length === 0) return;
  try {
    const supabase = getSupabase();
    const anonId = userId ? null : getOrCreateAnonId();
    const rows = attempts.map((a) => ({
      user_id: userId, anon_id: anonId,
      question_id: a.question.id, chosen: a.chosen, correct: a.correct,
    }));
    await supabase.from("attempts").insert(rows);
  } catch (e) { console.warn("attempts insert failed", e); }
}
