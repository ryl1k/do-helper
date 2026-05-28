"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSubjects, subjectInitials } from "@/lib/subjects";
import { useProfile } from "@/lib/auth";

export type NavSection = "home" | "subjects" | "test" | "catalog" | "qa" | null;

interface Props {
  active?: NavSection;
  currentSubjectSlug?: string | null;
}

// When the user opens a subject we cache its slug so "Тест" / "Каталог" can
// route to the last subject they were on instead of dead-linking to "/".
function readLastSubject(): string | null {
  if (typeof window === "undefined") return null;
  try { return localStorage.getItem("lastSubject"); } catch { return null; }
}

export function SideNav({ active = null, currentSubjectSlug = null }: Props) {
  const subjects = useSubjects() ?? [];
  const { profile } = useProfile();
  const isAdmin = !!profile?.is_admin;

  // Fallback subject for the workspace links: prefer current, then last-visited
  // (if still valid), then the first subject in the list.
  const [lastSlug, setLastSlug] = useState<string | null>(null);
  useEffect(() => { setLastSlug(readLastSubject()); }, []);

  const fallback =
    currentSubjectSlug ??
    (lastSlug && subjects.some((s) => s.slug === lastSlug) ? lastSlug : null) ??
    subjects[0]?.slug ??
    null;

  const items: { id: NavSection; name: string; href: string | null }[] = [
    { id: "home",    name: "Огляд",   href: "/" },
    { id: "test",    name: "Тест",    href: fallback ? `/${fallback}/quiz` : null },
    { id: "catalog", name: "Каталог", href: fallback ? `/${fallback}/search` : null },
    { id: "qa",      name: "Q/A",     href: "/faq" },
  ];

  const adminItems = [
    { name: "Питання",       href: "/admin/questions" },
    { name: "Теми",          href: "/admin/topics" },
    { name: "Предмети",      href: "/admin/subjects" },
    { name: "AI Import",     href: "/admin/import" },
    { name: "Студенти",      href: "/admin/users" },
    { name: "Аналітика",     href: "/admin/analytics" },
  ];

  return (
    <aside className="w-[200px] shrink-0 border-r border-line py-4 px-2 hidden md:block overflow-y-auto">
      <SectionLabel>Робоча область</SectionLabel>
      <ul className="mt-1.5 mb-5">
        {items.map((it) => {
          const on = active === it.id;
          if (!it.href) {
            return (
              <li key={it.name}>
                <div
                  className="block px-3 py-2 rounded-md mb-px text-[13px] text-ink-mute cursor-not-allowed select-none"
                  title="Спочатку обери предмет"
                >
                  {it.name}
                </div>
              </li>
            );
          }
          return (
            <li key={it.name}>
              <Link
                href={it.href}
                className={
                  "block px-3 py-2 rounded-md mb-px transition-colors text-[13px] " +
                  (on
                    ? "bg-surface2 text-ink font-medium"
                    : "text-ink-dim hover:text-ink hover:bg-surface")
                }
              >
                {it.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {subjects.length > 0 && (
        <>
          <SectionLabel>Предмети</SectionLabel>
          <ul className="mt-1.5 mb-5">
            {subjects.map((s) => {
              const on = s.slug === currentSubjectSlug;
              return (
                <li key={s.id}>
                  <Link
                    href={`/${s.slug}`}
                    className={
                      "flex items-center gap-2.5 px-3 py-2 rounded-md mb-px transition-colors " +
                      (on
                        ? "bg-surface2 text-ink"
                        : "text-ink-dim hover:text-ink hover:bg-surface")
                    }
                  >
                    <span className="size-[20px] rounded bg-surface flex items-center justify-center text-[10px] font-semibold text-cyan shrink-0">
                      {subjectInitials(s.name_uk)}
                    </span>
                    <span className="flex-1 text-[12.5px] truncate">{s.name_uk}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {/* Admin section — visible only when the signed-in user's profile.is_admin is true. */}
      {isAdmin && (
        <>
          <SectionLabel>Адмін</SectionLabel>
          <ul className="mt-1.5">
            {adminItems.map((it) => (
              <li key={it.name}>
                <Link
                  href={it.href}
                  className="block px-3 py-2 rounded-md mb-px text-[13px] text-ink-dim hover:text-ink hover:bg-surface transition-colors"
                >
                  {it.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 text-[10px] uppercase tracking-wider text-ink-mute font-semibold">
      {children}
    </div>
  );
}
