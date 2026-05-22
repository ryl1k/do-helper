"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ALL_CATEGORIES, categoryBadgeClass, categoryDotClass, effectiveCategories, shortLabel } from "@/lib/categories";
import { clearHistory, loadProfile, setProfileName, summarize, type ProfileData, type QuizResult } from "@/lib/stats";
import { useProfile } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase-client";
import { useT } from "@/lib/i18n";
import { letter, loadQuestions, type Question } from "@/lib/questions";

export default function ProfilePage() {
  const { t } = useT();
  const { session, profile: serverProfile, loading: authLoading } = useProfile();
  const [local, setLocal] = useState<ProfileData | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [serverStats, setServerStats] = useState<{ total: number; correct: number } | null>(null);
  const [questionMap, setQuestionMap] = useState<Map<number, Question>>(new Map());

  useEffect(() => {
    const p = loadProfile();
    setLocal(p);
    setDraft(p.name);
    // Load full question bank so we can render wrong-answer review in history.
    loadQuestions()
      .then((qs) => setQuestionMap(new Map(qs.map((q) => [q.number, q]))))
      .catch(() => {});
  }, []);

  // Server-side aggregate (only when logged in).
  useEffect(() => {
    if (!session?.user) { setServerStats(null); return; }
    const supabase = getSupabase();
    supabase
      .from("user_leaderboard")
      .select("total, correct")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setServerStats(data ? { total: Number(data.total), correct: Number(data.correct) } : { total: 0, correct: 0 });
      });
  }, [session]);

  const stats = useMemo(() => (local ? summarize(local.quizzes) : null), [local]);

  async function saveName() {
    const name = draft.trim();
    setProfileName(name);
    setLocal((d) => (d ? { ...d, name } : d));

    if (session?.user) {
      const supabase = getSupabase();
      await supabase.from("profiles").update({ display_name: name }).eq("id", session.user.id);
    }

    setEditing(false);
  }

  function reset() {
    if (!confirm("Clear all local quiz history?")) return;
    clearHistory();
    setLocal((d) => (d ? { ...d, quizzes: [] } : d));
  }

  const displayName = (serverProfile?.display_name?.trim() || local?.name?.trim() || "");
  const isLoggedIn = !!session?.user;

  if (!local || authLoading) {
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

  const empty = local.quizzes.length === 0 && (!serverStats || serverStats.total === 0);

  // Headline: prefer server stats if logged in, else local.
  const headlineQuizzes = local.quizzes.length;
  const headlineQuestions = isLoggedIn && serverStats ? serverStats.total : (stats?.totalQ ?? 0);
  const headlineCorrect = isLoggedIn && serverStats ? serverStats.correct : (stats?.totalC ?? 0);
  const headlineAcc = headlineQuestions > 0 ? Math.round((headlineCorrect / headlineQuestions) * 100) : null;

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <header className="flex items-center gap-4">
        <div className="size-14 sm:size-16 rounded-2xl bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 flex items-center justify-center text-xl sm:text-2xl font-bold shadow-sm">
          {(displayName || "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <div className="flex gap-2 items-center">
              <input
                value={draft}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveName()}
                placeholder={t("profile.editName")}
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-base focus:border-blue-500 dark:focus:border-sky-500"
              />
              <button type="button" onClick={saveName} className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 font-medium">{t("profile.save")}</button>
            </div>
          ) : (
            <>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight truncate">
                {displayName || t("profile.anonymous")}
              </h1>
              <div className="flex gap-3 items-center mt-0.5">
                {isLoggedIn && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">{session!.user.email}</div>
                )}
                <button
                  type="button"
                  onClick={() => { setDraft(displayName); setEditing(true); }}
                  className="text-xs text-blue-600 dark:text-sky-400 hover:underline"
                >
                  {displayName ? t("profile.editName") : t("profile.setName")}
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {!isLoggedIn && (
        <div className="rounded-2xl border border-amber-300 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-950/30 p-4 sm:p-5 flex items-start gap-3">
          <span className="inline-flex items-center justify-center size-9 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M12 9v4M12 17h.01" /><circle cx="12" cy="12" r="10" /></svg>
          </span>
          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-sm font-medium text-amber-900 dark:text-amber-200">{t("profile.guest")}</div>
            <div className="text-sm text-amber-800 dark:text-amber-300/80">{t("profile.guestExplain")}</div>
          </div>
          <Link
            href="/login"
            className="shrink-0 inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 text-sm font-semibold transition-colors"
          >
            {t("profile.signIn")}
          </Link>
        </div>
      )}

      <section className="grid grid-cols-3 gap-2 sm:gap-3">
        <Stat label={t("profile.stats.quizzes")} value={headlineQuizzes} />
        <Stat label={t("profile.stats.questions")} value={headlineQuestions} />
        <Stat
          label={t("profile.stats.accuracy")}
          value={headlineAcc !== null ? `${headlineAcc}%` : "—"}
          tone={headlineAcc !== null ? (headlineAcc >= 80 ? "good" : headlineAcc >= 50 ? "ok" : "low") : undefined}
        />
      </section>

      {empty ? (
        <div className="border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="text-slate-600 dark:text-slate-400">{t("profile.noQuizzes")}</div>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-semibold transition-colors"
          >
            {t("profile.firstQuiz")}
          </Link>
        </div>
      ) : (
        <>
          {stats && (
            <section className="space-y-3">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">{t("profile.byTopic")}</h2>
              <ul className="space-y-2">
                {ALL_CATEGORIES.map((c) => {
                  const s = stats.perCat[c];
                  const total = s?.total ?? 0;
                  const correct = s?.correct ?? 0;
                  const acc = total === 0 ? 0 : correct / total;
                  return (
                    <li key={c} className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className={`size-2 rounded-full ${categoryDotClass(c)}`} />
                        <span className="flex-1 truncate text-slate-700 dark:text-slate-300">{shortLabel(c)}</span>
                        <span className="text-xs tabular-nums text-slate-500 dark:text-slate-400">{total > 0 ? `${correct}/${total}` : "—"}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                        {total > 0 && (
                          <div className="h-full bg-blue-600 dark:bg-sky-500 transition-[width] duration-300" style={{ width: `${acc * 100}%` }} />
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400 font-medium">{t("profile.recent")}</h2>
              <button
                type="button"
                onClick={reset}
                className="text-xs text-slate-500 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
              >
                {t("profile.clearHistory")}
              </button>
            </div>
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden">
              {local.quizzes.slice(0, 10).map((q, i) => (
                <QuizHistoryRow key={i} q={q} questionMap={questionMap} />
              ))}
            </ul>
          </section>
        </>
      )}
    </main>
  );
}

function QuizHistoryRow({ q, questionMap }: { q: QuizResult; questionMap: Map<number, Question> }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const pct = q.total ? Math.round((q.correct / q.total) * 100) : 0;
  const wrong = q.outcomes.filter((o) => !o.correct);
  const canExpand = q.outcomes.length > 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => canExpand && setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm">
            <b className="tabular-nums">{q.correct}/{q.total}</b>
            <span className="text-slate-500 dark:text-slate-400 ml-2 text-xs">{new Date(q.date).toLocaleString()}</span>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {q.categories.length === ALL_CATEGORIES.length ? t("profile.allTopics") : q.categories.map((c) => shortLabel(c)).join(", ")}
          </div>
        </div>
        <span className={"text-sm font-semibold tabular-nums " + (pct >= 80 ? "text-emerald-600 dark:text-emerald-400" : pct >= 50 ? "text-blue-600 dark:text-sky-400" : "text-amber-600 dark:text-amber-400")}>
          {pct}%
        </span>
        <span className="text-slate-400 dark:text-slate-500" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={"transition-transform " + (open ? "rotate-180" : "")}><polyline points="6 9 12 15 18 9" /></svg>
        </span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-2">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {t("profile.wrongOf", { w: wrong.length, n: q.total })}
          </div>
          {wrong.length === 0 ? (
            <div className="text-sm text-emerald-600 dark:text-emerald-400">{t("profile.noWrongInQuiz")}</div>
          ) : (
            <ol className="space-y-2">
              {wrong.map((o, j) => {
                const question = questionMap.get(o.number);
                if (!question) {
                  return (
                    <li key={j} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 text-xs text-slate-500">
                      #{o.number} — question not found
                    </li>
                  );
                }
                return (
                  <li key={j} className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 space-y-2 bg-slate-50/40 dark:bg-slate-800/30">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {effectiveCategories(question.categories).map((c) => (
                        <span key={c} className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded border ${categoryBadgeClass(c)}`}>
                          <span className={`size-1.5 rounded-full ${categoryDotClass(c)}`} />
                          {shortLabel(c)}
                        </span>
                      ))}
                    </div>
                    <div className="text-sm">
                      <span className="text-xs text-slate-500 dark:text-slate-500 mr-2 tabular-nums">#{question.number}</span>
                      {question.text}
                    </div>
                    <ol className="space-y-1 text-sm">
                      {question.options.map((opt, k) => {
                        const isCorrect = question.correct_indices.includes(k);
                        const wasChosen = o.chosen?.includes(k);
                        let cls = "border-slate-200 dark:border-slate-800";
                        if (isCorrect) cls = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 dark:border-emerald-500/60";
                        else if (wasChosen) cls = "border-red-500 bg-red-50 dark:bg-red-950/40 dark:border-red-500/60";
                        return (
                          <li key={k} className={"flex items-start gap-2.5 rounded-lg border px-3 py-1.5 " + cls}>
                            <span className="opacity-50 w-4 shrink-0 text-xs pt-0.5">{letter(k)}.</span>
                            <span className="flex-1">{opt}</span>
                          </li>
                        );
                      })}
                    </ol>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      )}
    </li>
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
