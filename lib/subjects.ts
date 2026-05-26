"use client";
import { useEffect, useState } from "react";

export interface Subject {
  id: string;
  slug: string;
  name_uk: string;
  name_en: string;
  description: string | null;
  accent_color: string;
  question_count: number;
  topic_count: number;
  sort_order: number;
}

let _cache: Promise<Subject[]> | null = null;

export function loadSubjects(): Promise<Subject[]> {
  if (!_cache) {
    _cache = fetch("/api/subjects", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => (Array.isArray(j.subjects) ? (j.subjects as Subject[]) : []))
      .catch(() => [] as Subject[]);
  }
  return _cache;
}

export function clearSubjectsCache() { _cache = null; }

export function useSubjects(): Subject[] | null {
  const [subs, setSubs] = useState<Subject[] | null>(null);
  useEffect(() => { loadSubjects().then(setSubs); }, []);
  return subs;
}

export function useCurrentSubject(slug: string | null): Subject | null {
  const subs = useSubjects();
  if (!slug || !subs) return null;
  return subs.find((s) => s.slug === slug) ?? null;
}

// Two-character monogram for a subject. "Дослідження операцій" → "ДО",
// "Web Programming" → "WP", single-word like "kotek" → "KO".
export function subjectInitials(name: string): string {
  const clean = name.replace(/\(.*?\)/g, "").trim();
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return "??";
}
