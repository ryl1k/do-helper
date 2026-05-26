"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { Kbd } from "@/components/shell/Kbd";
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
  const initialCat = params.get("cat");
  const [qs, setQs] = useState<Question[] | null>(null);
  const [topics, setTopics] = useState<SubjectTopics | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<string | null>(initialCat);
  const [shown, setShown] = useState(PAGE_SIZE);
  const [revealAll, setRevealAll] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!subject) return;
    Promise.all([loadQuestions(subject), loadTopics(subject)])
      .then(([q, t]) => { setQs(q); setTopics(t); })
      .catch((e) => setErr(String(e?.message ?? e)));
  }, [subject]);

  useEffect(() => { setShown(PAGE_SIZE); }, [query, activeCat]);

  // "/" focuses search like Linear/GitHub.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault(); searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
      if (activeCat) {
        const eff = effectiveTopicSlugs(q.categories);
        if (!eff.includes(activeCat)) return false;
      }
      if (!needle) return true;
      if (q.text.toLowerCase().includes(needle)) return true;
      return q.options.some((o) => o.toLowerCase().includes(needle));
    });
  }, [qs, query, activeCat]);

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

  return (
    <AppShell active="catalog" subject={subject} crumbs={[{ label: "Каталог" }]}>
      <div className="flex flex-col h-full">
        {/* Filter bar */}
        <div className="px-6 sm:px-7 py-3 border-b border-line flex items-center gap-2.5">
          <div className="flex-1 max-w-2xl h-8 border border-line rounded-md flex items-center px-3 gap-2 bg-surface">
            <SearchIcon />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Пошук по ${qs?.length ?? "—"} питанням...`}
              className="bg-transparent flex-1 text-[13px] outline-none placeholder:text-ink-mute"
            />
            <Kbd>/</Kbd>
          </div>
          <button className="px-2.5 py-1.5 border border-line rounded-md text-[12px] text-ink-dim hover:text-ink hover:border-lineStrong flex items-center gap-1.5">
            <span>+</span> Фільтр
          </button>
          <button
            onClick={() => setRevealAll((v) => !v)}
            className={
              "px-2.5 py-1.5 border rounded-md text-[12px] flex items-center gap-1.5 transition-colors " +
              (revealAll
                ? "bg-cyan text-canvas border-cyan"
                : "border-line text-ink-dim hover:text-ink hover:border-lineStrong")
            }
          >
            {revealAll ? "Сховати відповіді" : "Показати відповіді"}
          </button>
        </div>

        {/* Topic chips */}
        {topics && (
          <div className="px-6 sm:px-7 py-2.5 border-b border-line flex items-center gap-1.5 flex-wrap">
            <span className="eyebrow mr-1">Теми</span>
            <Chip
              active={activeCat === null}
              label="усі"
              count={qs?.length ?? 0}
              onClick={() => setActiveCat(null)}
            />
            {topics.topics.map((t) => (
              <Chip
                key={t.slug}
                label={topicShortLabel(topics, t.slug)}
                count={counts[t.slug] ?? 0}
                active={activeCat === t.slug}
                dot={topicDotClass(topics, t.slug)}
                onClick={() => setActiveCat(activeCat === t.slug ? null : t.slug)}
              />
            ))}
          </div>
        )}

        {/* Counts row */}
        <div className="px-6 sm:px-7 py-2 border-b border-line text-[11px] text-ink-mute font-mono flex justify-between">
          <span>{filtered.length} питань · {Math.min(shown, filtered.length)} на сторінці</span>
          {err && <span className="text-bad">{err}</span>}
        </div>

        {/* Table */}
        <div className="flex-1 overflow-y-auto">
          {!qs && <Skeleton />}
          {visible.map((q) => (
            <CatalogRow key={q.id} q={q} topics={topics} reveal={revealAll} subject={subject} />
          ))}
          {hasMore && (
            <div ref={sentinelRef} className="py-6 flex justify-center">
              <div className="size-5 rounded-full border-2 border-line border-t-cyan animate-spin" />
            </div>
          )}
          {qs && filtered.length === 0 && (
            <div className="px-6 py-16 text-center text-ink-mute">
              <div className="text-[14px] mb-1">Нічого не знайдено</div>
              <div className="text-[12px]">Спробуй інший пошук або фільтр.</div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function CatalogRow({
  q, topics, reveal, subject,
}: { q: Question; topics: SubjectTopics | null; reveal: boolean; subject: string }) {
  const cats = effectiveTopicSlugs(q.categories);
  const noAnswer = q.correct_indices.length === 0;
  const acc = noAnswer ? null : 55; // placeholder; will be wired to question_stats later

  return (
    <div className="px-6 sm:px-7 py-3.5 border-b border-line grid grid-cols-[40px_1fr_60px_80px] gap-4 items-start hover:bg-surface/40 transition-colors">
      <span className="font-mono text-[12px] text-ink-mute pt-px">#{q.number}</span>
      <div className="min-w-0">
        <div className="text-[13px] font-medium mb-1.5">{q.text}</div>
        <div className="flex flex-wrap gap-1">
          {q.options.map((o, j) => {
            const isRight = reveal && q.correct_indices.includes(j);
            return (
              <span
                key={j}
                className={
                  "text-[11px] px-2 py-0.5 rounded font-mono inline-flex items-center gap-1.5 " +
                  (isRight
                    ? "bg-good/10 border border-good/40 text-good"
                    : "bg-surface border border-line text-ink-dim")
                }
              >
                <span className={isRight ? "text-good" : "text-ink-mute"}>{letter(j)}</span>
                <span className="truncate max-w-[24ch]">{o}</span>
              </span>
            );
          })}
        </div>
        {topics && cats.length > 0 && (
          <div className="flex items-center gap-3 mt-2 text-[11px] font-mono">
            {cats.map((c) => (
              <span key={c} className="inline-flex items-center gap-1.5 text-ink-mute">
                <span className={`size-1 rounded-full ${topicDotClass(topics, c)}`} />
                {topicShortLabel(topics, c)}
              </span>
            ))}
            {noAnswer && <span className="text-warn">немає відповіді</span>}
          </div>
        )}
      </div>
      <span className={`font-mono text-[11px] text-right pt-1 ${acc !== null && acc < 50 ? "text-warn" : "text-ink-dim"}`}>
        {acc !== null ? `${acc}%` : "—"}
      </span>
      <Link
        href={`/${subject}/quiz?from=${q.id}`}
        className="text-[11px] text-cyan text-right pt-1 hover:underline"
      >
        відкрити →
      </Link>
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
        "px-2.5 py-1 rounded-full text-[11px] inline-flex items-center gap-1.5 transition-colors " +
        (active
          ? "bg-cyan-soft text-cyan font-medium"
          : "border border-line text-ink-dim hover:text-ink hover:border-lineStrong")
      }
    >
      {dot && <span className={`size-1 rounded-full ${dot}`} />}
      <span>{label}</span>
      <span className="font-mono text-ink-mute">{count}</span>
    </button>
  );
}

function Skeleton() {
  return (
    <div className="divide-y divide-line">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="h-20 animate-pulse bg-surface/30" />
      ))}
    </div>
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
