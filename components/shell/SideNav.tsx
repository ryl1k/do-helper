"use client";
import Link from "next/link";
import { Kbd } from "./Kbd";
import { useSubjects } from "@/lib/subjects";
import { subjectInitials } from "@/lib/subjects";

export type NavSection = "home" | "subjects" | "test" | "catalog" | "qa" | null;

interface Props {
  active?: NavSection;
  currentSubjectSlug?: string | null;
}

export function SideNav({ active = null, currentSubjectSlug = null }: Props) {
  const subjects = useSubjects() ?? [];

  // Workspace links retarget to the currently-viewed subject when there is one;
  // otherwise they go to the hub. This keeps the sidebar from offering "Тест"
  // with no subject context.
  const subj = currentSubjectSlug ?? "";
  const items: { id: NavSection; name: string; href: string; kb: string }[] = [
    { id: "home",     name: "Огляд",    href: "/",                                 kb: "G H" },
    { id: "subjects", name: "Предмети", href: "/",                                 kb: "G S" },
    { id: "test",     name: "Тест",     href: subj ? `/${subj}/quiz` : "/",        kb: "T" },
    { id: "catalog",  name: "Каталог",  href: subj ? `/${subj}/search` : "/",      kb: "C" },
    { id: "qa",       name: "Q/A",      href: "/faq",                              kb: "?" },
  ];

  return (
    <aside className="w-[188px] shrink-0 border-r border-line py-3.5 px-2 text-[13px] hidden md:block">
      <SectionLabel>Робоча область</SectionLabel>
      <ul className="mt-1.5 mb-4">
        {items.map((it) => {
          const on = active === it.id;
          return (
            <li key={it.name}>
              <Link
                href={it.href}
                className={
                  "flex items-center justify-between px-2.5 py-1.5 rounded-md mb-px transition-colors " +
                  (on
                    ? "bg-surface2 text-ink font-medium"
                    : "text-ink-dim hover:text-ink hover:bg-surface")
                }
              >
                <span>{it.name}</span>
                <span className="font-mono text-[10px] text-ink-mute tracking-normal">{it.kb}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <SectionLabel>Предмети</SectionLabel>
      <ul className="mt-1.5">
        {subjects.map((s) => {
          const on = s.slug === currentSubjectSlug;
          return (
            <li key={s.id}>
              <Link
                href={`/${s.slug}`}
                className={
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-px transition-colors " +
                  (on
                    ? "bg-surface2 text-ink"
                    : "text-ink-dim hover:text-ink hover:bg-surface")
                }
              >
                <span className="size-[18px] rounded bg-surface flex items-center justify-center font-mono text-[9px] font-semibold text-cyan shrink-0">
                  {subjectInitials(s.name_uk)}
                </span>
                <span className="flex-1 text-[12px] truncate">{s.name_uk}</span>
              </Link>
            </li>
          );
        })}
        {subjects.length === 0 && (
          <li className="text-[11px] text-ink-mute px-2.5 py-1.5">
            Поки немає предметів
          </li>
        )}
      </ul>
    </aside>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow px-2.5">{children}</div>
  );
}
