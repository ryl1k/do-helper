"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { Kbd } from "@/components/shell/Kbd";
import { loadSubjects, subjectInitials, type Subject } from "@/lib/subjects";
import { loadProfile, summarize, type QuizResult } from "@/lib/stats";
import { useSession } from "@/lib/auth";

export default function HomePage() {
  const { session } = useSession();
  const [subjects, setSubjects] = useState<Subject[] | null>(null);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    loadSubjects().then(setSubjects).catch((e) => setErr(String(e?.message ?? e)));
    setHistory(loadProfile().quizzes);
  }, []);

  return (
    <AppShell active="home">
      <HomeContent subjects={subjects} history={history} err={err} session={session} />
    </AppShell>
  );
}

function HomeContent({
  subjects, history, err, session,
}: {
  subjects: Subject[] | null;
  history: QuizResult[];
  err: string | null;
  session: { user?: { email?: string } | null } | null;
}) {
  const overall = useMemo(() => summarize(history), [history]);
  const totalQuestions = useMemo(
    () => (subjects ?? []).reduce((sum, s) => sum + s.question_count, 0),
    [subjects],
  );
  const streak = useMemo(() => computeStreak(history), [history]);
  const weakTopics = useMemo(() => topWeakTopics(history, 3), [history]);

  const userName = session?.user?.email?.split("@")[0] ?? "";
  const greetingName = userName ? `, ${userName.charAt(0).toUpperCase() + userName.slice(1)}` : "";

  const mostRecentSubjectSlug = useMemo(() => {
    let best: { slug: string; t: number } | null = null;
    for (const q of history) {
      const t = Date.parse(q.date) || 0;
      if (!best || t > best.t) best = { slug: q.subject, t };
    }
    return best?.slug ?? null;
  }, [history]);

  const stats = [
    { l: "Опрацьовано", v: overall.totalQ.toString(), s: `/ ${totalQuestions} питань` },
    { l: "Точність", v: overall.totalQ ? `${Math.round(overall.accuracy * 100)}%` : "—", s: overall.totalQ ? "Усі предмети" : "немає сесій", up: overall.totalQ > 0 },
    { l: "Серія", v: streak.toString(), s: streak === 1 ? "день" : "днів поспіль" },
    { l: "Слабкі теми", v: weakTopics.length.toString(), s: weakTopics.length ? "потребують уваги" : "усе добре", warn: weakTopics.length > 0 },
  ];

  return (
    <div className="min-h-full">
      {/* Header */}
      <div className="px-6 sm:px-10 pt-8 pb-6 border-b border-line">
        <div className="eyebrow mb-2">
          Огляд · {subjects?.length ?? 0} {(subjects?.length ?? 0) === 1 ? "предмет" : "предметів"}
        </div>
        <h1 className="text-[28px] font-semibold tracking-tighter2">
          {greetingName ? `З поверненням${greetingName}.` : "Вітаємо."}
        </h1>
        <p className="text-[14px] text-ink-dim mt-1">
          {history.length === 0
            ? "Обери предмет нижче, щоб розпочати першу сесію."
            : <>Сьогодні рекомендуємо опрацювати <span className="text-cyan">слабкі теми</span> або продовжити поточний предмет.</>}
        </p>
        {err && <p className="text-bad text-sm mt-2">{err}</p>}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-line">
        {stats.map((s, i) => (
          <div
            key={i}
            className={`px-6 py-4 ${i < stats.length - 1 ? "border-r border-line" : ""} ${i < 2 ? "border-b sm:border-b-0 border-line" : ""}`}
          >
            <div className="eyebrow">{s.l}</div>
            <div className={`font-mono text-2xl font-medium tracking-tighter2 mt-1 ${s.warn ? "text-warn" : "text-ink"}`}>
              {s.v}
            </div>
            <div className={`text-[11px] mt-0.5 ${s.up ? "text-good" : "text-ink-mute"}`}>{s.s}</div>
          </div>
        ))}
      </div>

      {/* Two-col body */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-0 lg:divide-x lg:divide-line">
        {/* Left: subjects + recommendations */}
        <div className="px-6 sm:px-10 pt-5 pb-6 space-y-6">
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[13px] font-medium">Предмети</h2>
              <span className="text-[11px] text-ink-mute">Sort: остання активність</span>
            </div>

            {!subjects && <SubjectsSkeleton />}
            {subjects && subjects.length === 0 && <EmptySubjects />}
            {subjects && subjects.length > 0 && (
              <div className="panel divide-y divide-line overflow-hidden">
                {subjects.map((s) => {
                  const sStats = summarize(history, s.slug);
                  const done = sStats.totalQ;
                  const acc = sStats.totalQ ? Math.round(sStats.accuracy * 100) : null;
                  const empty = done === 0;
                  const active = s.slug === mostRecentSubjectSlug && !empty;
                  return (
                    <Link
                      key={s.id}
                      href={`/${s.slug}`}
                      className="grid grid-cols-[32px_1fr_auto_auto_auto] gap-3.5 items-center px-4 py-3.5 hover:bg-surface transition-colors group"
                    >
                      <div
                        className={`size-7 rounded-md font-mono text-[11px] font-bold flex items-center justify-center ${
                          empty
                            ? "bg-surface2 text-ink-mute"
                            : "text-canvas"
                        }`}
                        style={empty ? undefined : { background: "linear-gradient(135deg,#5eb6ff,#a78bfa)" }}
                      >
                        {subjectInitials(s.name_uk)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[13px] font-medium flex items-center gap-2">
                          <span className="truncate">{s.name_uk}</span>
                          {active && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-warn/10 text-warn uppercase tracking-wider font-semibold shrink-0">
                              активний
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-ink-mute mt-0.5 font-mono">
                          {s.question_count} питань · {s.topic_count} тем
                        </div>
                      </div>
                      <div className={`font-mono text-[12px] tabular-nums w-20 text-right ${empty ? "text-ink-mute" : "text-ink"}`}>
                        {empty ? "—" : `${done}/${s.question_count}`}
                      </div>
                      <div className={`font-mono text-[12px] tabular-nums w-14 text-right ${empty ? "text-ink-mute" : "text-cyan"}`}>
                        {empty ? "—" : `${acc}%`}
                      </div>
                      <div className="text-[11px] text-ink-dim flex items-center gap-1.5 w-[100px] justify-end">
                        {empty ? "Почати" : "Продовжити"}
                        <span className="text-ink-mute group-hover:translate-x-0.5 transition-transform">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {subjects && subjects.length > 0 && (
            <section>
              <h2 className="text-[13px] font-medium mb-3">Рекомендоване на сьогодні</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {(() => {
                  const target = mostRecentSubjectSlug ?? subjects[0].slug;
                  return (
                    <>
                      <RecCard
                        href={`/${target}/quiz`}
                        dot="bg-cyan"
                        label="Швидкий тест"
                        sub="15 питань · ~8 хв"
                      />
                      <RecCard
                        href={`/${target}/quiz?weak=1`}
                        dot="bg-warn"
                        label="Слабкі місця"
                        sub={weakTopics.length ? weakTopics.map((w) => w.cat).slice(0, 2).join(", ") : "Поки немає слабких тем"}
                      />
                    </>
                  );
                })()}
              </div>
            </section>
          )}
        </div>

        {/* Right: activity + weak topics */}
        <div className="px-6 sm:px-10 pt-5 pb-6 space-y-6 border-t lg:border-t-0 border-line">
          <section>
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-[13px] font-medium">Активність</h2>
              <span className="font-mono text-[11px] text-ink-mute">Останні 12 тижнів</span>
            </div>
            <Heatmap quizzes={history} />
            <div className="font-mono text-[11px] text-ink-mute mt-2 flex justify-between">
              <span>{history.length} {history.length === 1 ? "сесія" : "сесій"}</span>
              <span>{overall.totalQ.toLocaleString()} питань</span>
            </div>
          </section>

          <section>
            <h2 className="text-[13px] font-medium mb-3">Слабкі теми</h2>
            {weakTopics.length === 0 && (
              <div className="text-[12px] text-ink-mute py-4">
                Поки немає даних. Пройди кілька тестів — і теми з низькою точністю з'являться тут.
              </div>
            )}
            {weakTopics.map((w) => (
              <div key={w.cat} className="mb-2.5">
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-violet" />
                    {w.cat}
                  </span>
                  <span className="font-mono text-warn">{Math.round(w.acc * 100)}%</span>
                </div>
                <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                  <div className="h-full bg-warn opacity-70" style={{ width: `${w.acc * 100}%` }} />
                </div>
              </div>
            ))}
            {weakTopics.length > 0 && (
              <Link
                href={`/${mostRecentSubjectSlug ?? subjects?.[0]?.slug ?? ""}/quiz?weak=1`}
                className="mt-4 flex items-center justify-between px-3 py-2 border border-line rounded-md text-[12px] text-ink-dim hover:text-ink hover:border-lineStrong transition-colors"
              >
                <span>Створити тест зі слабких тем</span>
                <Kbd>F</Kbd>
              </Link>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function RecCard({ href, dot, label, sub }: { href: string; dot: string; label: string; sub: string }) {
  return (
    <Link
      href={href}
      className="panel p-3.5 hover:border-lineStrong transition-colors block"
    >
      <span className={`block size-1.5 rounded-full ${dot} mb-2`} />
      <div className="text-[13px] font-medium">{label}</div>
      <div className="text-[11px] text-ink-mute mt-0.5 line-clamp-1">{sub}</div>
    </Link>
  );
}

function SubjectsSkeleton() {
  return (
    <div className="panel divide-y divide-line">
      {[0, 1, 2].map((i) => (
        <div key={i} className="h-14 animate-pulse bg-surface2/30" />
      ))}
    </div>
  );
}

function EmptySubjects() {
  return (
    <div className="panel p-8 text-center space-y-2">
      <div className="text-[13px] text-ink-dim">Жодного предмета поки немає.</div>
      <Link href="/admin" className="text-[12px] text-cyan hover:underline">
        Додати перший →
      </Link>
    </div>
  );
}

// 12 weeks × 7 days heatmap based on quiz timestamps. Anchored to today; oldest
// column on the left.
function Heatmap({ quizzes }: { quizzes: QuizResult[] }) {
  const cells = useMemo(() => {
    const day = 24 * 60 * 60 * 1000;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = today.getTime() - 12 * 7 * day + day; // include today
    const counts: number[] = Array(12 * 7).fill(0);
    for (const q of quizzes) {
      const t = Date.parse(q.date);
      if (!Number.isFinite(t)) continue;
      const d = new Date(t); d.setHours(0, 0, 0, 0);
      const idx = Math.floor((d.getTime() - start) / day);
      if (idx >= 0 && idx < counts.length) counts[idx]++;
    }
    return counts;
  }, [quizzes]);

  function color(c: number) {
    if (c === 0) return "rgba(255,255,255,0.04)";
    if (c === 1) return "rgba(94,182,255,0.25)";
    if (c === 2) return "rgba(94,182,255,0.45)";
    if (c === 3) return "rgba(94,182,255,0.7)";
    return "rgba(94,182,255,0.95)";
  }

  return (
    <div className="grid grid-cols-12 gap-[3px] panel p-3">
      {cells.map((c, i) => (
        <div key={i} className="aspect-square rounded-[2px]" style={{ background: color(c) }} title={c ? `${c} ${c === 1 ? "сесія" : "сесій"}` : ""} />
      ))}
    </div>
  );
}

// Walk history newest-first; count consecutive days with at least one quiz,
// allowing "today" to be the most recent day. Returns 0 if no quiz happened
// today or yesterday (the streak is considered broken).
function computeStreak(history: QuizResult[]): number {
  const day = 24 * 60 * 60 * 1000;
  const seen = new Set<number>();
  for (const q of history) {
    const t = Date.parse(q.date); if (!Number.isFinite(t)) continue;
    const d = new Date(t); d.setHours(0, 0, 0, 0);
    seen.add(d.getTime());
  }
  if (seen.size === 0) return 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let cursor = today.getTime();
  if (!seen.has(cursor)) cursor -= day;          // allow yesterday
  if (!seen.has(cursor)) return 0;
  let n = 0;
  while (seen.has(cursor)) { n++; cursor -= day; }
  return n;
}

// Aggregate weakest categories across all subjects from local history.
function topWeakTopics(history: QuizResult[], limit: number): { cat: string; acc: number; total: number }[] {
  const s = summarize(history);
  const out = Object.entries(s.perCat)
    .map(([cat, v]) => ({ cat, total: v.total, correct: v.correct, acc: v.total ? v.correct / v.total : 0 }))
    .filter((x) => x.total >= 3 && x.acc < 0.7)
    .sort((a, b) => a.acc - b.acc || b.total - a.total)
    .slice(0, limit);
  return out;
}
