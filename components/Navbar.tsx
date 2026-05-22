"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleToggle } from "./LocaleToggle";
import { AuthButton } from "./AuthButton";
import { useT } from "@/lib/i18n";

export function Navbar() {
  const { t } = useT();
  return (
    <nav
      className="sticky top-0 z-40 backdrop-blur
                 bg-white/80 dark:bg-slate-950/80
                 border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 flex items-center gap-1 sm:gap-2">
        <Link href="/" className="flex items-center gap-2 mr-auto sm:mr-6" aria-label="Home">
          <Logo />
          <span className="font-semibold tracking-tight hidden xs:inline">
            do<span className="text-blue-600 dark:text-sky-400">·</span>{t("brand.suffix")}
          </span>
        </Link>

        <NavLink href="/quiz" icon={<PlayIcon />}>{t("nav.quiz")}</NavLink>
        <NavLink href="/search" icon={<SearchIcon />}>{t("nav.search")}</NavLink>

        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1 sm:mx-2" />

        <LocaleToggle />
        <ThemeToggle />
        <AuthButton />
      </div>
    </nav>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");
  return (
    <Link
      href={href}
      className={
        "inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium " +
        "transition-colors duration-150 " +
        (active
          ? "bg-blue-600 text-white dark:bg-sky-500 dark:text-slate-950 shadow-sm"
          : "text-slate-600 hover:text-blue-700 hover:bg-blue-50 " +
            "dark:text-slate-300 dark:hover:text-sky-300 dark:hover:bg-slate-800")
      }
    >
      <span className="inline-flex items-center" aria-hidden>{icon}</span>
      <span className="hidden sm:inline">{children}</span>
    </Link>
  );
}

function Logo() {
  return (
    <span className="inline-flex items-center justify-center size-8 rounded-lg bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow-sm">
      ДО
    </span>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
