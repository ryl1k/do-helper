"use client";
// Local-only quiz history. One bucket per browser, with each quiz tagged by subject.

export interface QuizResult {
  date: string;             // ISO
  subject: string;          // subject slug (e.g. "do", "webapps"). "" for pre-multi-subject rows.
  categories: string[];     // topic slugs the player picked for this quiz
  total: number;
  correct: number;
  outcomes: { number: number; correct: boolean; chosen?: number[]; categories: string[] }[];
}

export interface ProfileData {
  name: string;
  quizzes: QuizResult[];
}

const KEY = "profile";

function read(): ProfileData {
  if (typeof window === "undefined") return { name: "", quizzes: [] };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { name: "", quizzes: [] };
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return { name: "", quizzes: [] };
    return {
      name: typeof parsed.name === "string" ? parsed.name : "",
      quizzes: Array.isArray(parsed.quizzes)
        ? parsed.quizzes.map((q: any) => ({
            ...q,
            // Back-compat for entries saved before multi-subject existed.
            subject: typeof q.subject === "string" && q.subject ? q.subject : "do",
          }))
        : [],
    };
  } catch {
    return { name: "", quizzes: [] };
  }
}

function write(data: ProfileData) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
  } catch {}
}

export function loadProfile(): ProfileData {
  return read();
}

export function setProfileName(name: string) {
  const d = read();
  d.name = name;
  write(d);
}

export function recordQuiz(r: QuizResult) {
  const d = read();
  d.quizzes.unshift(r);
  if (d.quizzes.length > 100) d.quizzes.length = 100;
  write(d);
}

export function clearHistory() {
  const d = read();
  d.quizzes = [];
  write(d);
}

// Derived analytics. If `subjectFilter` is provided, only quizzes tagged with that
// subject are summarized; otherwise all quizzes across subjects are aggregated.
export function summarize(quizzes: QuizResult[], subjectFilter?: string) {
  const filtered = subjectFilter ? quizzes.filter((q) => q.subject === subjectFilter) : quizzes;
  let totalQ = 0;
  let totalC = 0;
  const perCat: Record<string, { total: number; correct: number }> = {};
  for (const q of filtered) {
    totalQ += q.total;
    totalC += q.correct;
    for (const o of q.outcomes) {
      for (const c of o.categories) {
        const s = perCat[c] ?? { total: 0, correct: 0 };
        s.total += 1;
        if (o.correct) s.correct += 1;
        perCat[c] = s;
      }
    }
  }
  const accuracy = totalQ === 0 ? 0 : totalC / totalQ;
  return { totalQ, totalC, accuracy, perCat };
}

// Distinct subjects ever played, sorted by most recent activity.
export function subjectsPlayed(quizzes: QuizResult[]): string[] {
  const seen = new Map<string, number>();
  for (const q of quizzes) {
    const t = Date.parse(q.date) || 0;
    const cur = seen.get(q.subject) ?? 0;
    if (t > cur) seen.set(q.subject, t);
  }
  return [...seen.entries()].sort((a, b) => b[1] - a[1]).map(([s]) => s);
}
