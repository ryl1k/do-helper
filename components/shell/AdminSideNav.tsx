"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { id: "questions",  href: "/admin/questions",  name: "Питання" },
  { id: "topics",     href: "/admin/topics",     name: "Теми" },
  { id: "subjects",   href: "/admin/subjects",   name: "Предмети" },
  { id: "import",     href: "/admin/import",     name: "AI Import" },
  { id: "mod",        href: "/admin/moderation", name: "Q/A модерація" },
  { id: "users",      href: "/admin/users",      name: "Студенти" },
  { id: "analytics",  href: "/admin/analytics",  name: "Аналітика" },
];

export function AdminSideNav() {
  const pathname = usePathname() ?? "";
  return (
    <aside className="w-[188px] shrink-0 border-r border-line py-3.5 px-2 text-[13px] hidden md:block">
      <div className="eyebrow px-2.5">Адмін</div>
      <ul className="mt-1.5">
        {ITEMS.map((it) => {
          const on = pathname.startsWith(it.href);
          return (
            <li key={it.id}>
              <Link
                href={it.href}
                className={
                  "block px-2.5 py-1.5 rounded-md mb-px transition-colors " +
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

      <div className="eyebrow px-2.5 mt-6">Назад</div>
      <ul className="mt-1.5">
        <li>
          <Link href="/" className="block px-2.5 py-1.5 rounded-md text-ink-dim hover:text-ink hover:bg-surface text-[13px]">
            ← Сайт
          </Link>
        </li>
      </ul>
    </aside>
  );
}
