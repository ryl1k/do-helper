"use client";
import Link from "next/link";
import { Logo } from "./Logo";
import { useSession } from "@/lib/auth";

interface Crumb {
  label: string;
  href?: string;
}

export function TopBar({
  crumbs = [],
}: {
  crumbs?: Crumb[];
  /** @deprecated retained for callsite compatibility; the search button was removed. */
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

      {session ? (
        <Link
          href="/profile"
          className="flex items-center gap-2 text-[12px] text-ink-dim hover:text-ink"
        >
          <span className="hidden sm:inline">{session.user?.email}</span>
          <span className="size-[24px] rounded-full bg-cyan-soft text-cyan flex items-center justify-center text-[11px] font-semibold">
            {initial}
          </span>
        </Link>
      ) : (
        <Link
          href="/login"
          className="px-3 py-1.5 rounded-md bg-cyan text-canvas text-[12px] font-semibold hover:bg-cyan/90"
        >
          Увійти
        </Link>
      )}
    </div>
  );
}
