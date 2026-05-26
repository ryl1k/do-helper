"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { loadQuestions, letter, type Question } from "@/lib/questions";
import { loadTopics, topicDotClass, topicShortLabel, effectiveTopicSlugs, type SubjectTopics } from "@/lib/topics";

export default function CatalogPage() {
  return (
    <Suspense fallback={null}>
      <CatalogInner />
    </Suspense>
  );
}

const PAGE_SIZE = 30;

function CatalogInner() {
  const { subject } = useParams<{ subject: string }>();
  const params = useSearchParams();
  // Multi-select chips. URL ?cat=foo&cat=bar (or comma-sep ?cat=foo,bar) seeds the initial set.
  const initialCats = useMemo(() => {
    const set = new Set<string>();
    const all = params.getAll("cat");
    for (const v of all) v.split(",").map((x) => x.trim()).filter(Boolean).forEach((x) => set.add(x));
    return set;
  }, [params]);

  const [qs, setQs] = useState<Question[] | null>(null);
  const [topics, setTopics] = useState<SubjectTopics | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Set<string>>(initialCats);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  // Answers are hidden by default so the row works as a self-test surface.
  // Toggling a row's id in here reveals the correct option + per-option explanations.
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  // Global toggle: "show answers" affects every expanded row at once.
  const [revealAll, setRevealAll] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!subject) return;
    Promise.all([loadQuestions(subject), loadTopics(subject)])
      .then(([q, t]) => { setQs(q); setTopics(t); })
      .catch((e) => setErr(String(e?.message ?? e)));
  }, [subject]);

  useEffect(() => { setShown(PAGE_SIZE); }, [query, active]);

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const q of qs ?? []) {
      for (const c of effectiveTopicSlugs(q.categories)) m[c] = (m[c] ?? 0) + 1;
    }
    return m;
  }, [qs]);

  const filtered = useMemo(() => {
    if (!qs) return [];
    const needle = query.trim().toLowerCase();
    return qs.filter((q) => {
      if (active.size > 0) {
        const eff = effectiveTopicSlugs(q.categories);
        if (!eff.some((c) => active.has(c))) return false;
      }
      if (!needle) return true;
      if (q.text.toLowerCase().includes(needle)) return true;
      return q.options.some((o) => o.toLowerCase().includes(needle));
    });
  }, [qs, query, active]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setShown((s) => Math.min(s + PAGE_SIZE, filtered.length));
    }, { rootMargin: "300px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [filtered.length]);

  const visible = filtered.slice(0, shown);
  const hasMore = shown < filtered.length;

  function toggleChip(slug: string) {
    setActive((cur) => {
      const next = new Set(cur);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  }
  function clearChips() { setActive(new Set()); }
  function toggleExpand(id: string) {
    setExpanded((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }
  function toggleRowReveal(id: string) {
    setRevealed((cur) => {
      const next = new Set(cur);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <AppShell active="catalog" subject={subject} crumbs={[{ label: "Каталог" }]}>
      <div className="flex flex-col h-full">
        {/* Search bar */}
        <div className="px-6 sm:px-7 py-3 border-b border-line">
          <div className="max-w-2xl h-9 border border-line rounded-md flex items-center px-3 gap-2 bg-surface focus-within:border-cyan transition-colors">
            <SearchIcon />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Пошук по ${qs?.length ?? "—"} питанням…`}
              className="bg-transparent flex-1 text-[13px] outline-none placeholder:text-ink-mute"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-ink-mute hover:text-ink text-[14px] leading-none" aria-label="Очистити">×</button>
            )}
          </div>
        </div>

        {/* Topic chips — multi-select. Click to add/remove; "усі" clears the set. */}
        {topics && (
          <div className="px-6 sm:px-7 py-3 border-b border-line flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase tracking-wider text-ink-mute font-semibold mr-1">Теми</span>
            <Chip
              active={active.size === 0}
              label="усі"
              count={qs?.length ?? 0}
              onClick={clearChips}
            />
            {topics.topics.map((t) => (
              <Chip
                key={t.slug}
                label={topicShortLabel(topics, t.slug)}
                count={counts[t.slug] ?? 0}
                active={active.has(t.slug)}
                dot={topicDotClass(topics, t.slug)}
                onClick={() => toggleChip(t.slug)}
              />
            ))}
            {active.size > 0 && (
              <button onClick={clearChips} className="text-[11px] text-ink-mute hover:text-ink underline underline-offset-2 ml-1">
                скинути
              </button>
            )}
          </div>
        )}

        {/* Counts + global show-answers toggle */}
        <div className="px-6 sm:px-7 py-2 border-b border-line text-[11px] text-ink-mute flex justify-between items-center gap-3">
          <span>
            {filtered.length} {filtered.length === 1 ? "питання" : "питань"}
            {active.size > 0 && <> · фільтр: <span className="text-ink-dim">{active.size} {active.size === 1 ? "тема" : "теми"}</span></>}
          </span>
          <div className="flex items-center gap-3">
            {err && <span className="text-bad">{err}</span>}
            <button
              onClick={() => setRevealAll((v) => !v)}
              className={
                "px-2.5 py-1 rounded border text-[11px] transition-colors " +
                (revealAll
                  ? "bg-cyan-soft text-cyan border-cyan/40"
                  : "border-line text-ink-dim hover:text-ink hover:border-lineStrong")
              }
              title="Показати/сховати відповіді в усіх розгорнутих питаннях"
            >
              {revealAll ? "сховати відповіді" : "показати відповіді"}
            </button>
          </div>
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {!qs && (
            <div className="divide-y divide-line">
              {[0, 1, 2, 3].map((i) => <div key={i} className="h-20 animate-pulse bg-surface/30" />)}
            </div>
          )}
          {visible.map((q) => (
            <CatalogRow
              key={q.id}
              q={q}
              topics={topics}
              open={expanded.has(q.id)}
              revealAnswers={revealAll || revealed.has(q.id)}
              onToggle={() => toggleExpand(q.id)}
              onToggleReveal={() => toggleRowReveal(q.id)}
            />
          ))}
          {hasMore && (
            <div ref={sentinelRef} className="py-6 flex justify-center">
              <div className="size-5 rounded-full border-2 border-line border-t-cyan animate-spin" />
            </div>
          )}
          {qs && filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-ink-mute">
              <div className="text-[14px] mb-1">Нічого не знайдено</div>
              <div className="text-[12px]">Спробуй інший пошук або зніми частину фільтрів.</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function CatalogRow({
  q, topics, open, revealAnswers, onToggle, onToggleReveal,
}: {
  q: Question;
  topics: SubjectTopics | null;
  open: boolean;
  revealAnswers: boolean;
  onToggle: () => void;
  onToggleReveal: () => void;
}) {
  const cats = effectiveTopicSlugs(q.categories);
  const noAnswer = q.correct_indices.length === 0;
  const multi = q.correct_indices.length > 1;
  const hasExplanations = !!q.explanations && q.explanations.some((e) => e?.trim());

  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        className="w-full px-6 sm:px-7 py-3.5 grid grid-cols-[40px_1fr_auto] gap-4 items-start text-left hover:bg-surface/40 transition-colors"
        aria-expanded={open}
      >
        <span className="text-[12px] text-ink-mute pt-px">#{q.number}</span>
        <div className="min-w-0">
          <div className="text-[13.5px] font-medium leading-snug">{q.text}</div>
          {topics && cats.length > 0 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px]">
              {cats.map((c) => (
                <span key={c} className="inline-flex items-center gap-1.5 text-ink-mute">
                  <span className={`size-1 rounded-full ${topicDotClass(topics, c)}`} />
                  {topicShortLabel(topics, c)}
                </span>
              ))}
              {noAnswer && <span className="text-warn">немає відповіді</span>}
              {multi && <span className="text-cyan">кілька правильних</span>}
            </div>
          )}
        </div>
        <span className={"text-ink-mute text-[14px] transition-transform " + (open ? "rotate-180" : "")}>▾</span>
      </button>

      {open && (
        <div className="px-6 sm:px-7 pb-4 grid grid-cols-[40px_1fr] gap-4">
          <div />
          <div>
            {/* Per-row reveal toggle: lets the user self-test, then peek. */}
            {!noAnswer && (
              <div className="flex items-center justify-end mb-2">
                <button
                  onClick={onToggleReveal}
                  className={
                    "px-2.5 py-1 rounded border text-[11px] inline-flex items-center gap-1.5 transition-colors " +
                    (revealAnswers
                      ? "bg-cyan-soft text-cyan border-cyan/40"
                      : "border-line text-ink-dim hover:text-ink hover:border-lineStrong")
                  }
                  aria-pressed={revealAnswers}
                >
                  <span aria-hidden>{revealAnswers ? "👁" : "👁‍🗨"}</span>
                  {revealAnswers ? "сховати відповідь" : "показати відповідь"}
                </button>
              </div>
            )}

            <ul className="space-y-1.5">
              {q.options.map((o, j) => {
                const correct = q.correct_indices.includes(j);
                const showCorrect = revealAnswers && correct;
                return (
                  <li
                    key={j}
                    className={
                      "flex items-start gap-2.5 rounded-md border px-3 py-2 text-[13px] " +
                      (showCorrect ? "border-good bg-good/[0.06]" : "border-line bg-surface")
                    }
                  >
                    <span className={"w-4 text-[11px] " + (showCorrect ? "text-good font-semibold" : "text-ink-mute")}>{letter(j)}</span>
                    <span className="flex-1">{o}</span>
                    {showCorrect && <span className="text-good text-[11px] shrink-0">✓</span>}
                  </li>
                );
              })}
            </ul>
            {revealAnswers && hasExplanations && (
              <div className="mt-3 space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-cyan font-semibold">Пояснення</div>
                <ol className="space-y-1.5 mt-1">
                  {q.options.map((_, j) => {
                    const e = q.explanations?.[j]?.trim(); if (!e) return null;
                    const correct = q.correct_indices.includes(j);
                    return (
                      <li key={j} className="flex gap-2.5 text-[12px] leading-relaxed">
                        <span className={"w-4 shrink-0 " + (correct ? "text-good" : "text-ink-mute")}>{letter(j)}</span>
                        <span className={correct ? "text-good" : "text-ink-dim"}>{e}</span>
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({
  label, count, active, dot, onClick,
}: { label: string; count: number; active: boolean; dot?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={
        "px-2.5 py-1 rounded-full text-[11.5px] inline-flex items-center gap-1.5 transition-colors " +
        (active
          ? "bg-cyan-soft text-cyan font-medium border border-cyan/40"
          : "border border-line text-ink-dim hover:text-ink hover:border-lineStrong")
      }
    >
      {dot && <span className={`size-1 rounded-full ${dot}`} />}
      <span>{label}</span>
      <span className={active ? "text-cyan/80" : "text-ink-mute"}>{count}</span>
    </button>
  );
}

function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <circle cx="6" cy="6" r="4.5" stroke="#6b7079" strokeWidth="1.3" />
      <path d="M9.5 9.5L12.5 12.5" stroke="#6b7079" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
