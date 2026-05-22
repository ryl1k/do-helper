"use client";
import Link from "next/link";
import { useState } from "react";
import { useProfile, signOut } from "@/lib/auth";
import { useT } from "@/lib/i18n";

export function AuthButton() {
  const { session, profile, loading } = useProfile();
  const { t } = useT();
  const [open, setOpen] = useState(false);

  if (loading) return <div className="size-9" aria-hidden />;

  if (!session) {
    return (
      <Link
        href="/login"
        className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-blue-700 hover:bg-blue-50 dark:text-slate-300 dark:hover:text-sky-300 dark:hover:bg-slate-800 transition-colors"
      >
        {t("nav.login")}
      </Link>
    );
  }

  const name = profile?.display_name || session.user.email?.split("@")[0] || "?";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-1 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="inline-flex items-center justify-center size-8 rounded-lg bg-blue-600 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm">
          {name.slice(0, 1).toUpperCase()}
        </span>
      </button>
      {open && (
        <>
          <button
            className="fixed inset-0 z-30"
            aria-hidden
            tabIndex={-1}
            onClick={() => setOpen(false)}
          />
          <div role="menu" className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg z-40 overflow-hidden">
            <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-800">
              <div className="text-xs text-slate-500 dark:text-slate-400">{t("profile.loggedInAs")}</div>
              <div className="text-sm font-medium truncate">{name}</div>
            </div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              role="menuitem"
              className="block px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {t("nav.profile")}
            </Link>
            <button
              type="button"
              role="menuitem"
              onClick={async () => { setOpen(false); await signOut(); }}
              className="w-full text-left block px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 text-red-600 dark:text-red-400"
            >
              {t("nav.logout")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
