"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/shell/AppShell";
import { loadQuestions, type Question } from "@/lib/questions";
import { loadTopics, topicDotClass, topicShortLabel, effectiveTopicSlugs, type SubjectTopics } from "@/lib/topics";
import { loadSubjects, subjectInitials, type Subject } from "@/lib/subjects";
import { loadProfile, summarize, type QuizResult } from "@/lib/stats";

export default function SubjectPage() {
  const { subject } = useParams<{ subject: string }>();
  const [qs, setQs] = useState<Question[] | null>(null);
  const [topics, setTopics] = useState<SubjectTopics | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!subject) return;
    Promise.all([loadQuestions(subject), loadTopics(subject), loadSubjects()])
      .then(([q, t, s]) => { setQs(q); setTopics(t); setSubjects(s); })
      .catch((e) => setErr(String(e?.message ?? e)));
    setHistory(loadProfile().quizzes);
  }, [subject]);

  // Remember last visited so the picker (or future onboarding) can auto-jump.
  useEffect(() => {
    if (typeof window !== "undefined" && subject) {
      try { localStorage.setItem("lastSubject", subject); } catch {}
    }
  }, [subject]);

  const subjectRow = subjects.find((s) => s.slug === subject) ?? null;
  const sStats = useMemo(() => summarize(history, subject ?? ""), [history, subject]);

  const topicStats = useMemo(() => {
    if (!qs || !topics) return [] as { slug: string; total: number; done: number; correct: number; acc: number }[];
    const totalByTopic = new Map<string, number>();
    for (const q of qs) {
      for (const c of effectiveTopicSlugs(q.categories)) {
        totalByTopic.set(c, (totalByTopic.get(c) ?? 0) + 1);
      }
    }
    return topics.topics.map((t) => {
      const total = totalByTopic.get(t.slug) ?? 0;
      const local = sStats.perCat[t.slug] ?? { total: 0, correct: 0 };
      return {
        slug: t.slug,
        total,
        done: local.total,
        correct: local.correct,
        acc: local.total ? local.correct / local.total : 0,
      };
    });
  }, [qs, topics, sStats]);

  const recentSessions = useMemo(() => history.filter((h) => h.subject === subject).slice(0, 3), [history, subject]);

  return (
    <AppShell active="subjects" subject={subject} crumbs={[{ label: subjectRow?.name_uk ?? subject }]}>
      <div className="min-h-full">
        {/* Header */}
        <div className="px-6 sm:px-10 pt-6 pb-5 border-b border-line">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="size-9 rounded-lg font-bold text-canvas flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#5eb6ff,#a78bfa)" }}
            >
              {subjectRow ? subjectInitials(subjectRow.name_uk) : "??"}
            </div>
            <div className="min-w-0">
              <h1 className="text-[22px] font-semibold tracking-tighter2 truncate">
                {subjectRow?.name_uk ?? subject}
              </h1>
              <div className="text-[12px] text-ink-mute mt-0.5">
                {subjectRow ? `${subjectRow.question_count} питань · ${subjectRow.topic_count} тем` : "…"}
                {sStats.totalQ > 0 && (
                  <> · <span className="text-cyan">{Math.round(sStats.accuracy * 100)}% точність</span></>
                )}
              </div>
            </div>
            <div className="flex-1" />
            <Link
              href={`/${subject}/quiz`}
              className="px-3.5 py-2 rounded-md bg-cyan text-canvas text-[12px] font-semibold inline-flex items-center gap-1.5 hover:bg-cyan/90 transition-colors"
            >
              <span>▶</span>
              Швидкий тест
            </Link>
          </div>

          {/* Tabs */}
          <nav className="flex gap-5 text-[13px] -mb-px overflow-x-auto">
            <TabLink href={`/${subject}`} active>Огляд</TabLink>
            <TabLink href={`/${subject}/search`}>Каталог</TabLink>
            <TabLink href={`/${subject}/quiz`}>Тест</TabLink>
            <TabLink href={`/faq`}>Q/A</TabLink>
          </nav>
        </div>

        {err && <div className="p-4 text-bad text-sm">{err}</div>}

        {/* Body */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-0 lg:divide-x lg:divide-line min-h-0">
          {/* Left: topics table */}
          <div className="px-6 sm:px-10 pt-5 pb-6">
            <div className="eyebrow mb-2.5">Теми · {topics?.topics.length ?? 0}</div>
            {!topics && <div className="panel p-6 text-ink-mute text-sm">Завантаження…</div>}
            {topics && topics.topics.length === 0 && (
              <div className="panel p-6 text-ink-mute text-sm">У цього предмета поки немає тем.</div>
            )}
            {topics && topics.topics.length > 0 && (
              <div className="panel overflow-hidden divide-y divide-line">
                {topicStats.map((t) => {
                  const label = topicShortLabel(topics, t.slug);
                  const dot = topicDotClass(topics, t.slug);
                  const pct = t.total ? Math.round((t.done / t.total) * 100) : 0;
                  const accColor = t.done === 0 ? "text-ink-mute" : t.acc < 0.5 ? "text-warn" : t.acc < 0.65 ? "text-ink" : "text-good";
                  return (
                    <Link
                      key={t.slug}
                      href={`/${subject}/search?cat=${encodeURIComponent(t.slug)}`}
                      className="grid grid-cols-[14px_1fr_90px_70px_70px_80px] gap-3.5 items-center px-4 py-2.5 hover:bg-surface transition-colors group"
                    >
                      <span className={`size-1.5 rounded-full ${dot}`} />
                      <span className="text-[13px] truncate">{label}</span>
                      <span className="text-[11px] text-ink-mute tabular-nums">
                        {t.done}/{t.total}
                      </span>
                      <div className="h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
                        <div className={`h-full ${dot} opacity-70`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className={`text-[12px] tabular-nums ${accColor}`}>
                        {t.done === 0 ? "—" : `${Math.round(t.acc * 100)}%`}
                      </span>
                      <span className="text-[11px] text-ink-dim text-right group-hover:text-cyan">Почати →</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right rail */}
          <div className="px-6 sm:px-10 pt-5 pb-6 space-y-5 border-t lg:border-t-0 border-line">
            <section>
              <div className="eyebrow mb-2.5">Швидкі дії</div>
              <div className="space-y-2">
                <QuickAction href={`/${subject}/quiz`} label="Тест" sub="Випадкові питання з тем" />
                <QuickAction href={`/${subject}/search`} label="Каталог" sub={`${subjectRow?.question_count ?? "—"} питань · фільтри`} />
                <QuickAction href={`/${subject}/quiz?weak=1`} label="Слабкі місця" sub="Низька точність" />
                <QuickAction href={`/faq`} label="Q/A" sub="Питання та відповіді" />
              </div>
            </section>

            <section>
              <div className="eyebrow mb-2.5">Останні сесії</div>
              {recentSessions.length === 0 && (
                <div className="text-[12px] text-ink-mute">Жодної сесії з цього предмета.</div>
              )}
              <div className="divide-y divide-line">
                {recentSessions.map((s, i) => {
                  const acc = s.total ? Math.round((s.correct / s.total) * 100) : 0;
                  return (
                    <div key={i} className="py-2.5">
                      <div className="text-[11px] text-ink-mute">{new Date(s.date).toLocaleString()}</div>
                      <div className="flex justify-between text-[12px] mt-0.5">
                        <span>{s.total} питань</span>
                        <span className={`${acc < 60 ? "text-warn" : "text-good"}`}>{acc}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function TabLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={
        "pb-2.5 -mb-px border-b transition-colors whitespace-nowrap " +
        (active
          ? "text-ink font-medium border-cyan"
          : "text-ink-dim hover:text-ink border-transparent")
      }
    >
      {children}
    </Link>
  );
}

function QuickAction({ href, label, sub }: { href: string; label: string; sub: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between p-3 panel hover:border-lineStrong transition-colors"
    >
      <div className="min-w-0">
        <div className="text-[13px] font-medium">{label}</div>
        <div className="text-[11px] text-ink-mute mt-0.5 truncate">{sub}</div>
      </div>
      <span className="text-ink-mute">→</span>
    </Link>
  );
}
