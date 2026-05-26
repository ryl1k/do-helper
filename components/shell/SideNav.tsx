"use client";
import Link from "next/link";
import { useSubjects } from "@/lib/subjects";
import { subjectInitials } from "@/lib/subjects";

export type NavSection = "home" | "subjects" | "test" | "catalog" | "qa" | null;

interface Props {
  active?: NavSection;
  currentSubjectSlug?: string | null;
}

export function SideNav({ active = null, currentSubjectSlug = null }: Props) {
  const subjects = useSubjects() ?? [];

  // Workspace links retarget to the current subject when one's in context.
  // No keyboard hints — too much chrome for too little use.
  const subj = currentSubjectSlug ?? "";
  const items: { id: NavSection; name: string; href: string }[] = [
    { id: "home",     name: "Огляд",    href: "/" },
    { id: "test",     name: "Тест",     href: subj ? `/${subj}/quiz` : "/" },
    { id: "catalog",  name: "Каталог",  href: subj ? `/${subj}/search` : "/" },
    { id: "qa",       name: "Q/A",      href: "/faq" },
  ];

  return (
    <aside className="w-[200px] shrink-0 border-r border-line py-4 px-2 hidden md:block">
      <SectionLabel>Робоча область</SectionLabel>
      <ul className="mt-1.5 mb-5">
        {items.map((it) => {
          const on = active === it.id;
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
          <ul className="mt-1.5">
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
