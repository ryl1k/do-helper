"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/shell/AppShell";
import { useProfile } from "@/lib/auth";
import { clearHistory, loadProfile, setProfileName, summarize, subjectsPlayed, type ProfileData, type QuizResult } from "@/lib/stats";
import { loadSubjects, type Subject } from "@/lib/subjects";
import { loadQuestions, letter, type Question } from "@/lib/questions";

export default function ProfilePage() {
  const { session, profile: serverProfile } = useProfile();
  const [local, setLocal] = useState<ProfileData | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  // Subject slug -> (question number -> Question). Lazy-filled when a session is opened.
  const [questionsBySubject, setQuestionsBySubject] = useState<Map<string, Map<number, Question>>>(new Map());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const p = loadProfile();
    setLocal(p);
    setDraft(p.name);
    loadSubjects().then(setSubjects).catch(() => {});
  }, []);

  function ensureSubjectLoaded(slug: string) {
    if (!slug || questionsBySubject.has(slug)) return;
    loadQuestions(slug)
      .then((qs) => {
        const m = new Map<number, Question>();
        for (const q of qs) m.set(q.number, q);
        setQuestionsBySubject((cur) => {
          if (cur.has(slug)) return cur;
          const next = new Map(cur);
          next.set(slug, m);
          return next;
        });
      })
      .catch(() => {});
  }

  const displayName = (serverProfile?.display_name?.trim() || local?.name?.trim() || session?.user?.email?.split("@")[0] || "");
  const initials = (displayName || "?").slice(0, 1).toUpperCase();

  const overall = useMemo(() => (local ? summarize(local.quizzes) : null), [local]);
  const subjMap = useMemo(() => new Map(subjects.map((s) => [s.slug, s])), [subjects]);

  async function saveName() {
    const name = draft.trim();
    setProfileName(name);
    setLocal((d) => (d ? { ...d, name } : d));
    if (session?.user) {
      const { getSupabase } = await import("@/lib/supabase-client");
      await getSupabase().from("profiles").update({ display_name: name }).eq("id", session.user.id);
    }
    setEditing(false);
  }

  function reset() {
    if (!confirm("Очистити локальну історію тестів?")) return;
    clearHistory();
    setLocal((d) => (d ? { ...d, quizzes: [] } : d));
  }

  async function signOut() {
    const { getSupabase } = await import("@/lib/supabase-client");
    await getSupabase().auth.signOut();
    window.location.href = "/";
  }

  return (
    <AppShell crumbs={[{ label: "Профіль" }]}>
      <div className="min-h-full">
        {/* Header */}
        <div className="px-6 sm:px-10 py-7 border-b border-line flex items-center gap-4">
          <div
            className="size-14 rounded-xl flex items-center justify-center font-bold text-canvas text-xl"
            style={{ background: "linear-gradient(135deg,#5eb6ff,#a78bfa)" }}
          >
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="flex gap-2 items-center">
                <input
                  value={draft}
                  autoFocus
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveName()}
                  placeholder="Ім'я"
                  className="flex-1 bg-surface border border-line rounded-md px-3 py-1.5 text-[14px] outline-none focus:border-cyan"
                />
                <button onClick={saveName} className="px-3 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold">
                  Зберегти
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-[22px] font-semibold tracking-tighter2 truncate">
                  {displayName || "Без імені"}
                </h1>
                <div className="flex gap-3 items-center mt-1">
                  {session?.user?.email && <span className="text-[12px] text-ink-mute">{session.user.email}</span>}
                  <button
                    onClick={() => { setDraft(displayName); setEditing(true); }}
                    className="text-[11px] text-cyan hover:underline"
                  >
                    {displayName ? "змінити" : "встановити ім'я"}
                  </button>
                </div>
              </>
            )}
          </div>
          {session ? (
            <button onClick={signOut} className="px-3 py-1.5 rounded-md border border-line text-[12px] text-ink-dim hover:text-bad hover:border-bad/40">
              Вийти
            </button>
          ) : (
            <Link href="/login" className="px-3 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold">
              Увійти
            </Link>
          )}
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-line">
          {[
            { l: "Тестів", v: local?.quizzes.length ?? 0 },
            { l: "Питань", v: overall?.totalQ ?? 0 },
            { l: "Точність", v: overall && overall.totalQ ? `${Math.round(overall.accuracy * 100)}%` : "—" },
            { l: "Активних предметів", v: local ? subjectsPlayed(local.quizzes).length : 0 },
          ].map((s, i) => (
            <div key={i} className={`px-6 py-4 ${i < 3 ? "border-r border-line" : ""} ${i < 2 ? "border-b sm:border-b-0 border-line" : ""}`}>
              <div className="eyebrow">{s.l}</div>
              <div className="text-2xl font-medium tracking-tighter2 mt-1 tabular-nums">{s.v}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-7 px-6 sm:px-10 py-6">
          {/* History */}
          <section>
            <div className="flex items-baseline justify-between mb-2.5">
              <h2 className="text-[13px] font-medium">Історія сесій</h2>
              <span className="text-[11px] text-ink-mute">останні 30</span>
            </div>
            {local && local.quizzes.length === 0 && (
              <div className="panel p-10 text-center space-y-2">
                <div className="text-[14px] text-ink-dim">Тестів поки немає.</div>
                <Link href="/" className="text-[12px] text-cyan hover:underline">Обрати предмет →</Link>
              </div>
            )}
            {local && local.quizzes.length > 0 && (
              <div className="panel divide-y divide-line overflow-hidden">
                {local.quizzes.slice(0, 30).map((q, i) => (
                  <HistoryRow
                    key={i}
                    q={q}
                    subj={subjMap.get(q.subject) ?? null}
                    questions={questionsBySubject.get(q.subject) ?? null}
                    onWillExpand={() => ensureSubjectLoaded(q.subject)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Settings */}
          <section className="space-y-6">
            <div>
              <h2 className="text-[13px] font-medium mb-2.5">Дані</h2>
              <div className="panel p-3.5 space-y-3">
                <div className="text-[12px] text-ink-dim leading-relaxed">
                  Локальна історія: <span className="text-ink tabular-nums">{local?.quizzes.length ?? 0} сесій</span> на цьому пристрої.
                </div>
                <button
                  onClick={reset}
                  className="w-full px-3 py-2 border border-line rounded-md text-[12px] text-bad hover:bg-bad/[0.08] hover:border-bad/40 transition-colors"
                >
                  Очистити локальну історію
                </button>
              </div>
            </div>

            {!session && (
              <div className="panel p-4 border-warn/30 bg-warn/[0.04]">
                <div className="text-[13px] font-medium text-warn mb-1">Не увійшов</div>
                <p className="text-[12px] text-ink-dim leading-relaxed">
                  Статистика зберігається лише на цьому пристрої. Увійди, щоб синхронізувати між пристроями.
                </p>
                <Link href="/login" className="inline-block mt-3 px-3 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold">
                  Увійти →
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function HistoryRow({
  q, subj, questions, onWillExpand,
}: {
  q: QuizResult;
  subj: Subject | null;
  questions: Map<number, Question> | null;
  onWillExpand: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"wrong" | "all">("wrong");
  const acc = q.total ? Math.round((q.correct / q.total) * 100) : 0;
  const wrong = q.outcomes.filter((o) => !o.correct);
  const canExpand = q.outcomes.length > 0;
  const tag = subj
    ? subj.name_uk.split(/\s+/).map((w) => w[0]?.toUpperCase()).slice(0, 2).join("")
    : q.subject.slice(0, 2).toUpperCase();

  function handleClick() {
    if (!canExpand) return;
    if (!open) onWillExpand();
    setOpen((v) => !v);
  }

  const list = filter === "wrong" ? wrong : q.outcomes;

  return (
    <div>
      <button
        onClick={handleClick}
        className="w-full grid grid-cols-[160px_38px_1fr_70px_24px] gap-3 items-center px-4 py-3 text-left hover:bg-surface transition-colors"
      >
        <span className="text-[11px] text-ink-mute tabular-nums">{new Date(q.date).toLocaleString()}</span>
        <span className="text-[10px] font-semibold text-cyan px-1.5 py-0.5 bg-cyan-soft rounded inline-block text-center w-fit">
          {tag}
        </span>
        <span className="text-[12px]">
          <span className="tabular-nums">{q.total}</span> питань · <span className="tabular-nums">{wrong.length}</span> помилок
        </span>
        <span className={`text-[12px] text-right tabular-nums ${acc < 60 ? "text-warn" : "text-good"}`}>{acc}%</span>
        <span className={"text-ink-mute text-[11px] transition-transform " + (open ? "rotate-180" : "")}>▾</span>
      </button>

      {open && (
        <div className="border-t border-line bg-canvas px-4 py-3 space-y-3">
          {/* Filter */}
          <div className="flex items-center justify-between gap-3">
            <div className="eyebrow">Питання</div>
            {wrong.length > 0 && wrong.length < q.total && (
              <div className="inline-flex rounded border border-line overflow-hidden text-[11px]">
                <button
                  onClick={() => setFilter("wrong")}
                  className={"px-2 py-0.5 transition-colors " + (filter === "wrong" ? "bg-surface2 text-ink" : "text-ink-dim hover:text-ink")}
                >
                  помилкові ({wrong.length})
                </button>
                <button
                  onClick={() => setFilter("all")}
                  className={"px-2 py-0.5 transition-colors " + (filter === "all" ? "bg-surface2 text-ink" : "text-ink-dim hover:text-ink")}
                >
                  усі ({q.total})
                </button>
              </div>
            )}
          </div>

          {/* Question details */}
          {!questions && <div className="text-[12px] text-ink-mute">Завантаження питань…</div>}
          {questions && (
            <ul className="space-y-3">
              {list.map((o, j) => {
                const qq = questions.get(o.number);
                if (!qq) {
                  return (
                    <li key={j} className="text-[12px] text-ink-mute">
                      #{o.number} — питання не знайдено (можливо було видалене)
                    </li>
                  );
                }
                const cls = o.correct
                  ? "border-good/30 bg-good/[0.04]"
                  : "border-bad/30 bg-bad/[0.04]";
                return (
                  <li key={j} className={"rounded-md border p-3 " + cls}>
                    <div className="flex items-baseline gap-2.5 mb-2">
                      <span className="text-[11px] text-ink-mute tabular-nums">#{qq.number}</span>
                      <span className="text-[13px] flex-1">{qq.text}</span>
                      <span className={"text-[10px] uppercase tracking-wider font-semibold " + (o.correct ? "text-good" : "text-bad")}>
                        {o.correct ? "правильно" : "помилка"}
                      </span>
                    </div>
                    <ul className="space-y-1">
                      {qq.options.map((opt, k) => {
                        const isCorrect = qq.correct_indices.includes(k);
                        const wasChosen = o.chosen?.includes(k);
                        const optCls = isCorrect
                          ? "border-good bg-good/[0.06]"
                          : wasChosen ? "border-bad bg-bad/[0.06]" : "border-line bg-surface";
                        return (
                          <li key={k} className={"rounded border px-2.5 py-1.5 text-[12px] flex items-start gap-2 " + optCls}>
                            <span className={"w-4 text-[10px] " + (isCorrect ? "text-good" : wasChosen ? "text-bad" : "text-ink-mute")}>
                              {letter(k)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <span className="text-good text-[10px]">✓</span>}
                            {wasChosen && !isCorrect && <span className="text-bad text-[10px]">×</span>}
                          </li>
                        );
                      })}
                    </ul>
                    {qq.explanations && qq.explanations.some((e) => e?.trim()) && (
                      <div className="mt-2 space-y-1">
                        {qq.options.map((_, k) => {
                          const e = qq.explanations?.[k]?.trim(); if (!e) return null;
                          const isCorrect = qq.correct_indices.includes(k);
                          return (
                            <div key={k} className="text-[11.5px] flex gap-2 leading-relaxed">
                              <span className={"w-4 shrink-0 " + (isCorrect ? "text-good" : "text-ink-mute")}>{letter(k)}</span>
                              <span className={isCorrect ? "text-good" : "text-ink-dim"}>{e}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
