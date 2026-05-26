"use client";
import Link from "next/link";
import { Kbd } from "./Kbd";
import { Logo } from "./Logo";
import { useSession } from "@/lib/auth";

interface Crumb {
  label: string;
  href?: string;
}

export function TopBar({
  crumbs = [],
  showSearch = true,
}: {
  crumbs?: Crumb[];
  showSearch?: boolean;
}) {
  const { session } = useSession();
  const initial = (session?.user?.email ?? "?").slice(0, 1).toUpperCase();

  return (
    <div className="h-11 border-b border-line bg-canvas flex items-center px-4 gap-3.5 text-[13px] text-ink">
      <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="oistudy">
        <Logo />
        <span className="text-ink-mute text-xs">oistudy</span>
      </Link>

      {crumbs.length > 0 && (
        <div className="flex items-center gap-2.5 min-w-0">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-2.5 min-w-0">
              <span className="text-ink-mute shrink-0">/</span>
              {c.href ? (
                <Link
                  href={c.href}
                  className="text-ink font-medium truncate hover:text-cyan transition-colors"
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-ink font-medium truncate">{c.label}</span>
              )}
            </span>
          ))}
        </div>
      )}

      <div className="flex-1" />

      {showSearch && (
        <button
          type="button"
          className="hidden sm:flex items-center gap-1 text-[12px] text-ink-dim hover:text-ink transition-colors"
          aria-label="Пошук"
        >
          <span className="px-2 py-1 rounded-md bg-surface2">Пошук</span>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </button>
      )}

      <Link
        href={session ? "/profile" : "/login"}
        className="size-[22px] rounded border border-line flex items-center justify-center text-[11px] text-ink-dim hover:border-lineStrong hover:text-ink transition-colors"
        aria-label="Профіль"
      >
        {initial}
      </Link>
    </div>
  );
}
