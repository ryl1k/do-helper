"use client";
// Local-only quiz history. Stored in localStorage as JSON.
// Saved when a quiz finishes (see /quiz).

export interface QuizResult {
  date: string;          // ISO
  categories: string[];  // categories the player picked
  total: number;
  correct: number;
  // Per-question outcomes are kept compact so we can rebuild "review wrong" later.
  outcomes: { number: number; correct: boolean; categories: string[] }[];
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
      quizzes: Array.isArray(parsed.quizzes) ? parsed.quizzes : [],
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
  d.quizzes.unshift(r); // newest first
  // cap at 100 history entries
  if (d.quizzes.length > 100) d.quizzes.length = 100;
  write(d);
}

export function clearHistory() {
  const d = read();
  d.quizzes = [];
  write(d);
}

// Derived analytics
export function summarize(quizzes: QuizResult[]) {
  let totalQ = 0;
  let totalC = 0;
  const perCat: Record<string, { total: number; correct: number }> = {};
  for (const q of quizzes) {
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
