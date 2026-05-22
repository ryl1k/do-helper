export interface Question {
  id: string;
  number: number;
  text: string;
  options: string[];
  correct_indices: number[];
  categories: string[];
  language: string;
}

// Tiny in-module cache: the question bank is static after seeding, so fetching
// once per page load is plenty. We don't store in localStorage to keep refresh semantics simple.
let _cache: Question[] | null = null;

export async function loadQuestions(force = false): Promise<Question[]> {
  if (_cache && !force) return _cache;
  const r = await fetch("/api/questions", { cache: "no-store" });
  const j = await r.json();
  if (!r.ok) throw new Error(j.error || "failed to load questions");
  _cache = j.questions as Question[];
  return _cache;
}

export function isUnanswerable(q: Question): boolean {
  return q.correct_indices.length === 0;
}

export const LETTERS = ["а", "б", "в", "г", "д", "е", "ж"]; // Ukrainian a/б/в/г...

export function letter(i: number): string {
  return LETTERS[i] ?? String(i + 1);
}
